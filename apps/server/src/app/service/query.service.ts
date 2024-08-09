import { Injectable } from '@nestjs/common';
import { b } from 'baml_client';
import pgStructure, { Table } from 'pg-structure';
import { Connection } from 'prisma/prisma-client';

@Injectable()
export class QueryService {
  async generate(userRequest: string, connection: Connection): Promise<string> {
    const ddlStatements = await this.ddlStatements(connection);
    const sql = await b.GenerateSQL(userRequest, ddlStatements);
    // validations
    return sql;
  }

  private async ddlStatements(connection: Connection): Promise<string> {
    const db = await pgStructure(
      {
        host: connection.host,
        port: connection.port,
        database: connection.database,
        user: connection.username,
        password: connection.password,
      },
      { includeSchemas: [connection.schema] }
    );

    const tables = db.schemas.get(connection.schema).tables;
    const tableMetadata = tables
      .map((table) => this.tableMetadata(connection.schema, table))
      .join('\n');
    const relationshipMetadata = tables
      .map((table) => this.relationshipMetadata(connection.schema, table))
      .join('');
    return `${tableMetadata}\n${relationshipMetadata}`;
  }

  private tableMetadata(schema: string, table: Table): string {
    let createStatement = `CREATE TABLE "${schema}"."${table.name}" (`;
    table.columns.forEach((column) => {
      createStatement += `${column.name} ${column.type.name}`;
      if (column.notNull) {
        createStatement += ' NOT NULL';
      }
      createStatement += ', ';
    });
    createStatement = createStatement.slice(0, -2);
    createStatement += ');\n';

    return createStatement;
  }

  private relationshipMetadata(schema: string, table: Table): string {
    let relationshipStatement = '';
    for (const fk of table.foreignKeys) {
      const foreignTable = fk.table.name;
      for (const column of fk.columns) {
        relationshipStatement += `-- ${schema}.${table.name}.${column.name} can be joined with ${schema}.${foreignTable}.${column.name}\n`;
      }
    }
    return relationshipStatement;
  }
}
