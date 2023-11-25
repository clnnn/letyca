import { Body, Controller, Post } from '@nestjs/common';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { ChartService } from '../../domain/chart.service';
import { PrismaService } from '../data-access/prisma.service';
import OpenAI from 'openai';
import { SqlDatabase } from 'langchain/sql_db';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

@Controller('charts')
export class ChartController {
  constructor(
    private prisma: PrismaService,
    private service: ChartService,
    private client: OpenAI
  ) {}

  @Post()
  async generateChart(@Body() request: ChartRequest): Promise<ChartResponse> {
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: request.connectionId,
      },
    });

    return await this.service.generate(request.humanQuery, connection);
  }

  @Post('/v2')
  async generateChartV2(@Body() request: ChartRequest): Promise<ChartResponse> {
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: request.connectionId,
      },
    });

    const database = await SqlDatabase.fromOptionsParams({
      appDataSourceOptions: {
        type: 'postgres',
        database: connection.database,
        username: connection.username,
        password: connection.password,
        host: connection.host,
        port: connection.port,
      },
    });
    const schema = await database.getTableInfo();
    const question = request.humanQuery;
    const sqlQueryCompletion = await this.client.chat.completions.create({
      model: 'gpt-4',
      temperature: 0,
      stop: '\nSQLResult:',
      messages: [
        {
          role: 'assistant',
          content: `You are SQL Generator assistent. Based on the provided SQL table schema below, answer the user question using just a SQL Query and nothing else.
          ---------
          SCHEMA: ${schema}
          _________
          SQL Query:`,
        },
        {
          role: 'system',
          content: 'Extract only SQL query from the assistent response',
        },
        {
          role: 'user',
          content: `${question}`,
        },
      ],
    });
    const sqlQuery = sqlQueryCompletion.choices[0].message.content;
    console.log(sqlQuery);
    const sqlResponse = await database.run(sqlQuery);

    const zodSchema = z.object({
      chartType: z
        .enum(['countLabel', 'pie', 'line'])
        .describe('The type of the chart'),
      title: z
        .string()
        .describe('The title of the chart. Should start with uppercase'),
      countLabelData: z
        .number()
        .describe('The count value of the count label')
        .optional(),
      pieChartData: z
        .object({
          labels: z.array(z.string()).describe('The labels for the pie chart.'),
          values: z.array(z.number()).describe('The values for the pie chart.'),
        })
        .optional(),
      lineChartData: z
        .object({
          points: z
            .array(
              z
                .object({
                  x: z
                    .number()
                    .describe('The X coordinate of a data point of line chart'),
                  y: z
                    .number()
                    .describe('The Y coordinate of a data point of line chart'),
                })
                .describe('A data point')
            )
            .describe('An array of data points for line chart'),
        })
        .optional(),
    });

    const chartCompletion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'assistant',
          content: `Based on the SQL Response, answer the user question using a JSON Response:
          ---------
          SQL Response: ${sqlResponse}
          ---------
          JSON Response:
          `,
        },
        {
          role: 'user',
          content: `${question}`,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generateChart',
            parameters: zodToJsonSchema(zodSchema),
            description: 'Generates a chart based on the schema',
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'generateChart',
        },
      },
    });

    console.log(
      chartCompletion.choices[0].message.tool_calls[0].function.arguments
    );

    // just for testing
    return {
      chartType: 'countLabel',
    };
  }
}
