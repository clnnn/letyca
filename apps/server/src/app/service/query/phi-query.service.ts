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

    console.log(result.response);
    return {
      prompt,
      rawResponse: result.response,
      sqlQuery: extractSQLQuery(result.response),
      columns: extractColumnNames(result.response),
    };
  }

  private prompt(metadata: string, userRequest: string): string {
    return `
    ### Task
    Generate a PostgreSQL query to answer [QUESTION]${userRequest}[/QUESTION]
    
    ### Instructions
    - Always use Table Aliases & Column Aliases to prevent ambiguity. For example, ${'```sql'}SELECT t1.col1 as label, t2.col1 as value FROM table1 t1 JOIN table2 t2 ON t1.id = t2.id ${'```'}".
    - If the query requires an average on a date, be sure to use the AVG(EXTRACT(YEAR FROM date)) function to a number
    - Generate only the SQL query, with the semicolon at the end. The SQL should be always formatted;
    - Please answer the user question using just a SQL Query and nothing else. If it is possible, try to get human readable data from tables that can be represented in a chart
    - If user request a query that may generate a single row, single column value, use column name 'value' as alias. If user request data that can be represented in a bar chart, line chart or pie chart and the query select multiple columns then always use column names 'label' and 'value' as aliases.


    ### Database Schema
    This query will run on a database whose schema is represented in this string:
    ${metadata}

    ### Answer
    Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]:
    ${'```sql'}
    `;
  }
}
