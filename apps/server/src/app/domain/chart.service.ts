import { ChartResponse } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  RunnablePassthrough,
  RunnableSequence,
} from 'langchain/schema/runnable';
import { SqlDatabase } from 'langchain/sql_db';
import { Connection } from 'prisma/prisma-client';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { promptTemplate } from './prompt';
import { parser } from './parser';
import { OutputFixingParser } from 'langchain/output_parsers';

@Injectable()
export class ChartService {
  constructor(private model: ChatOpenAI) {}

  async generate(
    humanQuery: string,
    connection: Connection
  ): Promise<ChartResponse> {
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

    const sqlQueryChain = RunnableSequence.from<
      {
        schema: string;
        question: string;
      },
      string
    >([
      {
        schema: (input) => input.schema,
        question: (input) => input.question,
      },
      promptTemplate.sqlRequest,
      this.model.bind({ stop: ['\nSQLResult:'] }),
      new StringOutputParser(),
    ]);

    const chain = RunnableSequence.from<
      {
        schema: string;
        question: string;
        formatInstructions: string;
      },
      ChartResponse
    >([
      RunnablePassthrough.assign({
        query: sqlQueryChain,
      }),
      {
        question: (input) => input.question,
        query: (input) => input.query,
        schema: (input) => input.schema,
        formatInstructions: (input) => input.formatInstructions,
        response: async (input) => database.run(input.query),
      },
      promptTemplate.chartRequest,
      this.model,
      parser.chart,
    ]);

    const response = await chain.invoke({
      question: humanQuery,
      schema: await database.getTableInfo(),
      formatInstructions: parser.chart.getFormatInstructions(),
    });

    try {
      parser.chart.parse(JSON.stringify(response));
      return response;
    } catch {
      const fixParser = OutputFixingParser.fromLLM(this.model, parser.chart);
      return fixParser.parse(JSON.stringify(response));
    }
  }
}
