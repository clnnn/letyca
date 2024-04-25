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
    - Use Table Aliases to prevent ambiguity. For example, "SELECT t1.col1 as label, t2.col1 as value FROM table1 t1 JOIN table2 t2 ON t1.id = t2.id".
    - Make sure to use 'value' as the alias for any numerical or aggregate values and 'label' as the alias for descriptive fields in the SELECT clause. This naming convention is crucial for integrating the query outputs into our visualization tools.
    - If the query requires an average on a date, be sure to use the AVG(EXTRACT(YEAR FROM date)) function to a number
    - Generate only the SQL query, with the semicolon at the end. The SQL should be always formatted;

    ### Database Schema
    This query will run on a database whose schema is represented in this string:
    ${metadata}

    ### Examples

    #### Example 1 - "total number of products":

    ${'```sql'}
    SELECT COUNT(*) AS value, 'Total Number of Products' AS label\nFROM products p;
    ${'```'}

    #### Example 2 - "total number of products by category":

    ${'```sql'}
    SELECT c.category_name AS label, COUNT(p.product_id) AS value\nFROM products p JOIN categories c ON p.category_id = c.category_id\nGROUP BY c.category_name;
    ${'```'}

    
    #### Example 3 - "total number of products by category in a pie chart":
    ${'```sql'}
    SELECT c.category_name AS label, COUNT(p.product_id) AS value\nFROM products p JOIN categories c ON p.category_id = c.category_id\nGROUP BY c.category_name;
    ${'```'}

    #### Example 4 - "total number of products by category, ordered by category name":
    ${'```sql'}
    SELECT c.category_name AS label, COUNT(p.product_id) AS value\nFROM products p JOIN categories c ON p.category_id = c.category_id\nGROUP BY c.category_name ORDER BY c.category_name;
    ${'```'}

    #### Example 5 - "Top 5 customers by revenue":
    ${'```sql'}
    SELECT c.company_name AS label, SUM(od.unit_price * od.quantity) AS value\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_details od ON o.order_id = od.order_id\nGROUP BY c.company_name\nORDER BY value\nDESC LIMIT 5;
    ${'```'}

    #### Example #6 - "monthly sales of condiments in 1997":
    ${'```sql'}
    SELECT TO_CHAR(o.order_date, 'YYYY-MM') AS label, \nSUM(od.quantity * od.unit_price * (1 - od.discount)) AS value \nFROM orders o \nINNER JOIN order_details od ON o.order_id = od.order_id \nINNER JOIN products p ON od.product_id = p.product_id \nINNER JOIN categories c ON p.category_id = c.category_id \nWHERE c.category_name = 'Condiments' AND EXTRACT(YEAR FROM o.order_date) = 1997 \nGROUP BY TO_CHAR(o.order_date, 'YYYY-MM') \nORDER BY label;
    ${'```'}
    
    ### Answer
    Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]:
    ${'```sql'}
    `;
    const result = await this.ollama.generate({
      model: 'sqlcoder',
      stream: false,
      prompt,
      options: {
        stop: ['```'],
      },
    });

    console.log(result.response);
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
