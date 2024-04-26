import { Injectable } from '@nestjs/common';
import { Connection } from 'prisma/prisma-client';
import { SqlDatabase } from 'langchain/sql_db';
import OpenAI from 'openai';
import { QueryResponse } from './query-response.model';
import { QueryService } from './query.service';
import { ChatCompletionMessageParam } from 'openai/resources';
import { extractColumnNames } from '../../utils';

@Injectable()
export class OpenAIQueryService extends QueryService {
  constructor(private readonly llm: OpenAI) {
    super();
  }

  private async langchainBasedMetadata(
    connection: Connection
  ): Promise<string> {
    // TODO: Replace Langchain with pg-structure and model metadata based on https://arxiv.org/abs/2204.00498
    const db = await SqlDatabase.fromOptionsParams({
      appDataSourceOptions: {
        type: 'postgres',
        database: connection.database,
        username: connection.username,
        password: connection.password,
        host: connection.host,
        port: connection.port,
      },
    });
    return db.getTableInfo();
  }

  async translate(
    userRequest: string,
    connection: Connection
  ): Promise<QueryResponse> {
    const metadata = await this.langchainBasedMetadata(connection);
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are PostgreSQL Generator assistant expert in generating PostgreSQL queries based on this schema [[${metadata}]]. Please answer the user question using just a SQL Query and nothing else. If it is possible, try to get human readable data from tables that can be represented in a chart.
          If user request a query that may generate a single row, single column value, use column name 'value' as alias. If user request data that can be represented in a bar chart, line chart or pie chart and the query select multiple columns then always use column names 'label' and 'value' as aliases.
          Examples:
          Example #1
          user: "total number of products"
          assistant: "SELECT COUNT(*) AS value FROM products p"
          Example #2
          user: "number of products by category"
          assistant: "SELECT c.category_name AS label, COUNT(*) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name"
          Example #3
          user: "total sales by month"
          assistant: "SELECT EXTRACT(MONTH FROM s.date) AS label, SUM(s.sales) AS value FROM sales s GROUP BY EXTRACT(MONTH FROM s.date)"`,
      },
      {
        role: 'system',
        content: 'Extract only SQL query from the assistant response',
      },
      {
        role: 'user',
        content: `${userRequest}`,
      },
    ];
    const completion = await this.llm.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.2,
      messages: messages,
    });

    const assistantResponse = completion.choices[0].message.content;
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    return {
      prompt,
      rawResponse: assistantResponse,
      sqlQuery: assistantResponse,
      columns: extractColumnNames(assistantResponse),
    };
  }
}
