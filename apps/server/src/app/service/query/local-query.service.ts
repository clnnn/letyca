import { Connection } from 'prisma/prisma-client';
import { QueryResponse } from './query-response.model';
import { QueryService } from './query.service';
import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import { MetadataService } from './metadata.service';
import { extractSQLQuery } from '../../utils';

@Injectable()
export class LocalQueryService extends QueryService {
  private readonly model = 'letyca-text-to-sql';
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
    const prompt = this.prompt(userRequest, metadata);

    const result = await this.ollama.generate({
      model: this.model,
      stream: false,
      prompt,
    });

    console;
    const rawResponse = result.response;
    const sqlQuery = extractSQLQuery(rawResponse);

    return {
      prompt,
      rawResponse,
      sqlQuery,
    };
  }

  private prompt(userRequest: string, metadata: string): string {
    return `<|begin_of_text|><|start_header_id|>user<|end_header_id|>
    Generate a SQL query to answer this question: \`${userRequest}\`.
    - If you cannot answer the question with the available database schema, return 'I do not know'
    - Remember that revenue is price multiplied by quantity
    - Remember that cost is supply_price multiplied by quantity
    - The aggregate function has always the alias 'value' d
    - The group by column has always the alias 'label'

    DDL statements:
    ${metadata}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>
    
    The following SQL query best answers the question \`${userRequest}\`:
    \`\`\`sql`;
  }
}
