import { Injectable } from '@nestjs/common';
import { QueryService } from './query.service';
import { Connection } from 'prisma/prisma-client';
import pgStructure, { Table } from 'pg-structure';
import { Ollama } from 'ollama';

@Injectable()
export class SQLCoderQueryService extends QueryService {
  constructor(private readonly ollama: Ollama) {
    super();
  }

  protected async metadata(connection: Connection): Promise<string> {
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

  protected async chatResponse(
    userRequest: string,
    metadata: string
  ): Promise<string> {
    const prompt = `
    ### Task
    Generate a PostgreSQL query to answer [QUESTION]${userRequest}[/QUESTION]
    
    ### Instructions
    - Use Table Aliases to prevent ambiguity. For example, "SELECT t1.col1, t2.col1 FROM table1 t1 JOIN table2 t2 ON t1.id = t2.id".
    - Always use 'value' and 'label' column aliases. It is very important.
    - Generate only the SQL query, with the semicolon at the end. 

    ### Database Schema
    This query will run on a database whose schema is represented in this string:
    ${metadata}

    ### Examples

    #### Example 1 - "total number of products":
    "SELECT COUNT(*) AS value, 'Total Number of Products' AS label FROM products p;"

    #### Example 2 - "total number of products by category":
    "SELECT c.category_name AS label, COUNT(p.product_id) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name;"

    #### Example 3 - "total number of products by category, ordered by category name":
    "SELECT c.category_name AS label, COUNT(p.product_id) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name ORDER BY c.category_name;"

    #### Example 4 - "Top 5 customers by revenue":
    "SELECT c.company_name AS label, SUM(od.unit_price * od.quantity) AS value FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_details od ON o.order_id = od.order_id GROUP BY c.company_name ORDER BY value DESC LIMIT 5;"
    
    ### Answer
    Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]
    [SQL]`;
    const result = await this.ollama.generate({
      model: 'sqlcoder',
      stream: false,
      prompt,
    });

    return this.extractSQLQuery(result.response);
  }

  private extractSQLQuery(inputString: string): string | null {
    const sqlRegex = /SELECT\s+.*?;\s*/gis; // Regular expression to match SQL SELECT statements
    const sqlMatch = inputString.match(sqlRegex);
    if (sqlMatch) {
      return sqlMatch.join(' ');
    } else {
      return inputString; // it is what it is :D
    }
  }
}
