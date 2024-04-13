import { Injectable } from '@nestjs/common';
import { SqlDatabase } from 'langchain/sql_db';
import { Connection } from 'prisma/prisma-client';
import { Ollama } from 'ollama';

@Injectable()
export class QueryService {
  async generate(userRequest: string, connection: Connection): Promise<string> {
    const database = await this.getDatabase(connection);
    const schema = await database.getTableInfo();
    const sqlQuery = await this.createChatCompletion(userRequest, schema);
    console.log(sqlQuery);
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
  ): Promise<string> {
    const ollama = new Ollama({ host: 'http://ollama-server:11434' });
    await ollama
      .pull({
        model: 'sqlcoder',
      })
      .then((res) => console.log(res));
    // const chatResponse = await ollama.chat({
    //   model: 'sqlcoder',
    //   stream: false,
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `You are PostgreSQL Generator assistant expert in generating PostgreSQL queries.
    //     ### Instructions
    //     Your task is to convert an user question/demand into a SQL query, given a Postgres database schema.
    //     Adhere to these rules:
    //       - **Deliberately go through the question and database schema word by word** to appropriately answer the question
    //       - **Use Table Aliases** to prevent ambiguity. For example, 'SELECT table1.col1, table2.col1 FROM table1 JOIN table2 ON table1.id = table2.id'.
    //       - When creating a ratio, always cast the numerator as float
    //       - **Use Aliases** for column names. If user request a query that may generate a single row, single column value, use column name 'value' as alias. If user request data that can be represented in a bar chart, line chart or pie chart and the query select multiple columns then always use column names 'label' and 'value' as aliases.

    //     ### Input:
    //     Generate a SQL query that answers the question '${userRequest}'
    //     This query will run on a database whose schema is represented in this string:
    //     ${schema}

    //     ### SQL Output:
    //     `,
    //     },
    //     {
    //       role: 'system',
    //       content: 'Extract only SQL query from the assistant response',
    //     },
    //   ],
    // });

    console.log(schema);
    const chatResponse = await ollama.generate({
      model: 'sqlcoder',
      stream: false,
      prompt: `### Task
      Generate a SQL query to answer [QUESTION]${userRequest}[/QUESTION]
      
      ### Instructions
      - Use Table Aliases to prevent ambiguity. For example, 'SELECT table1.col1, table2.col1 FROM table1 JOIN table2 ON table1.id = table2.id'.
      - When requesting single-row, single-column data, alias the column as 'value'. For multi-column data suitable for charts (bar, line, pie), alias columns as 'label' and 'value'.
      
      ### Examples
      Example #1
      user: "total number of products"
      assistant: "SELECT COUNT(*) AS value FROM products p"

      Example #2
      user: "number of products by category"
      assistant: "SELECT c.category_name AS label, COUNT(*) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name"

      Example #3
      user: "total sales by month"
      assistant: "SELECT EXTRACT(MONTH FROM s.date) AS label, SUM(s.sales) AS value FROM sales s GROUP BY EXTRACT(MONTH FROM s.date)"
      
      ### Database Schema
      This query will run on a database whose schema is represented in this string:
      ${schema}
      
      ### Answer
      Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]
      [SQL]`,
    });

    console.log(chatResponse);
    return chatResponse.response;
  }
}
