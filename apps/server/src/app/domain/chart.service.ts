import { ChartResponse } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { RunnableSequence } from 'langchain/schema/runnable';
import { SqlDatabase } from 'langchain/sql_db';
import { Connection } from 'prisma/prisma-client';
import { generateSQLPrompt } from './generate-sql.prompt';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { chartSchema } from './chart.schema';
import { generateChartPrompt } from './generate-chart.prompt';

@Injectable()
export class ChartService {
  private readonly generateSQLPrompt = generateSQLPrompt;
  private readonly generateChartPrompt = generateChartPrompt;
  private readonly jsonSchema = chartSchema;

  constructor(private model: ChatOpenAI) {}

  async generate(
    query: string,
    connection: Connection
  ): Promise<ChartResponse> {
    const database = await SqlDatabase.fromOptionsParams({
      appDataSourceOptions: {
        type: 'postgres',
        database: connection.database, // e.g. northwind
        username: connection.username, // e.g. postgres
        password: connection.password, // e.g. postgres
        host: connection.host, // e.g. localhost
        port: connection.port, // e.g. 55432
      },
    });

    const sqlQueryGeneratorChain = RunnableSequence.from([
      {
        schema: async () => database.getTableInfo(),
        question: (input: { question: string }) => input.question,
      },
      this.generateSQLPrompt,
      this.model.bind({ stop: ['\nSQLResult:'] }),
      new StringOutputParser(),
    ]);

    const fullChain = RunnableSequence.from([
      {
        question: (input) => input.question,
        query: sqlQueryGeneratorChain,
      },
      {
        schema: async () => database.getTableInfo(),
        question: (input) => input.question,
        query: (input) => input.query,
        response: (input) => database.run(input.query),
        json_schema: () => JSON.stringify(this.jsonSchema),
      },
      this.generateChartPrompt,
      this.model,
    ]);

    const response = await fullChain.invoke({
      question: query,
    });

    return JSON.parse(response.content);
  }
}
