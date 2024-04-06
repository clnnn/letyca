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
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `You are SQL Generator assistant expert in generating SQL queries based on this schema [[${schema}]].Please answer the user question using just a SQL Query and nothing else.`,
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
    const sqlQuery = sqlQueryCompletion.choices[0].message.content;
    return sqlQuery;
  }

  async runQuery(query: string, database: SqlDatabase): Promise<string> {
    return await database.run(query);
  }
}
