import { Injectable } from '@nestjs/common';
import { Connection } from 'prisma/prisma-client';
import { Ollama } from 'ollama';
import { MetadataService } from './metadata.service';
import { QueryResponse } from './query-response.model';
import { QueryService } from './query.service';
import { extractColumnNames, extractSQLQuery } from '../../utils';

@Injectable()
export class PhiQueryService extends QueryService {
  private readonly model = 'phi3';

  constructor(
    private readonly ollama: Ollama,
    private readonly metadata: MetadataService
  ) {
    super();
  }

  async translate(
    userRequest: string,
    connection: Connection
  ): Promise<QueryResponse> {
    const metadata = await this.metadata.byConnection(connection);
    const prompt = this.prompt(metadata, userRequest);

    const result = await this.ollama.generate({
      model: this.model,
      stream: false,
      prompt,
    });

    const rawResponse = result.response;
    const sqlQuery = extractSQLQuery(rawResponse);
    const columns = extractColumnNames(sqlQuery);

    return {
      prompt,
      rawResponse,
      sqlQuery,
      columns,
    };
  }

  private prompt(metadata: string, userRequest: string): string {
    const beginSQL = '```sql';
    const endSQL = '```';
    return `
    ### Task
    Generate a PostgreSQL query to answer [QUESTION]${userRequest}[/QUESTION]. The query is used to get data that can be represented in a chart. The count label, pie chart, bar chart, and line chart are the most common types of charts used to represent data.
    
    ### Instructions
    - Always use Table Aliases & Column Aliases to prevent ambiguity.
    - Generate only the SQL query, with the semicolon at the end. The SQL should be always well formatted and between triple ticks ${beginSQL} and${endSQL};
    - Please answer the user question using just a SQL Query and nothing else.
    - Always try to join other tables if needed to get human readable data.
    - If user request a query that may generate a single row, single column value, use column name 'value' as alias. If user request data that can be represented in a bar chart, line chart or pie chart and the query select multiple columns then always use column names 'label' and 'value' as aliases.

    ### Examples

    Example #1
    user: "total number of products"
    assistant: "${beginSQL}SELECT COUNT(*) AS value\nFROM products p;${endSQL}"

    Example #2
    user: "number of products by category"
    assistant: "${beginSQL}SELECT c.category_name AS label, COUNT(*) AS value\nFROM products p JOIN categories c ON p.category_id = c.category_id\nGROUP BY c.category_name;${endSQL}"

    Example #3
    user: "total sales by month"
    assistant: "${beginSQL}SELECT EXTRACT(MONTH FROM s.date) AS label, SUM(s.sales) AS value\nFROM sales s\nGROUP BY EXTRACT(MONTH FROM s.date);${endSQL}"

    ### Database Schema
    This query will run on a database whose schema is represented in this string:
    ${metadata}
    

    ### Answer
    Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]:
    ${beginSQL}
    `;
  }
}
