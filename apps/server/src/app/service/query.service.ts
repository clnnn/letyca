import { Injectable } from '@nestjs/common';
import { SqlDatabase } from 'langchain/sql_db';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import { Connection } from 'prisma/prisma-client';

@Injectable()
export class QueryService {
  constructor(private readonly client: OpenAI) {}

  async generate(userRequest: string, connection: Connection): Promise<string> {
    const database = await this.getDatabase(connection);
    const schema = await database.getTableInfo();
    const completion = await this.createChatCompletion(userRequest, schema);
    const sqlQuery = completion.choices[0].message.content;
    return sqlQuery;
  }

  private getDatabase(connection: Connection): Promise<SqlDatabase> {
    return SqlDatabase.fromOptionsParams({
      appDataSourceOptions: {
        type: 'postgres',
        database: connection.database,
        username: connection.username,
        password: connection.password,
        host: connection.host,
        port: connection.port,
      },
    });
  }

  private async createChatCompletion(
    userRequest: string,
    schema: string
  ): Promise<ChatCompletion> {
    return this.client.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `You are PostgreSQL Generator assistant expert in generating PostgreSQL queries based on this schema [[${schema}]]. Please answer the user question using just a SQL Query and nothing else. If it is possible, try to get human readable data from tables that can be represented in a chart.

          If user request a query that may generate a single row, single column value, use column name 'value' as alias. If user request data that can be represented in a bar chart, line chart or pie chart and the query select multiple columns then always use column names 'label' and 'value' as aliases.
          Examples:
          Example #1
          user: "total number of products"
          assistant: "SELECT COUNT(*) AS value FROM products"
          Example #2
          user: "number of products by category"
          assistant: "SELECT category AS label, COUNT(*) AS value FROM products JOIN categories ON products.category_id = categories.category_id GROUP BY category_name"
          Example #3
          user: "total sales by month"
          assistant: "SELECT EXTRACT(MONTH FROM date) AS label, SUM(sales) AS value FROM sales GROUP BY EXTRACT(MONTH FROM date)"
          `,
        },
        {
          role: 'system',
          content: 'Extract only SQL query from the assistant response',
        },
        {
          role: 'user',
          content: `${userRequest}`,
        },
      ],
    });
  }
}
