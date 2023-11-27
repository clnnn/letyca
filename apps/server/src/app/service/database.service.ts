import { Injectable } from '@nestjs/common';
import { SqlDatabase } from 'langchain/sql_db';
import OpenAI from 'openai';
import { Connection } from 'prisma/prisma-client';

@Injectable()
export class DatabaseService {
  constructor(private readonly client: OpenAI) {}

  async getDatabase(connection: Connection): Promise<SqlDatabase> {
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
    return database;
  }

  async generateQuery(schema: string, userRequest: string): Promise<string> {
    const sqlQueryCompletion = await this.client.chat.completions.create({
      model: 'gpt-4',
      temperature: 0,
      stop: '\nSQLResult:',
      messages: [
        {
          role: 'assistant',
          content: `You are SQL Generator assistant. Based on the provided SQL table schema below, answer the user question using just a SQL Query and nothing else.
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
          content: `${userRequest}`,
        },
      ],
    });
    const sqlQuery = sqlQueryCompletion.choices[0].message.content;
    return sqlQuery;
  }

  async runQuery(query: string, database: SqlDatabase): Promise<string> {
    return await database.run(query);
  }
}
