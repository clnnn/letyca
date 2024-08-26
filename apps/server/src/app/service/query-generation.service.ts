import { Injectable, Logger } from '@nestjs/common';
import { b } from 'baml_client';
import { Connection } from 'prisma/prisma-client';
import { DDLService } from './ddl.service';
import { InvalidQuery, QueryParsingService } from './query-parsing.service';
import { SQLQuery } from '@letyca/contracts';

@Injectable()
export class QueryGenerationService {
  private readonly logger = new Logger(QueryGenerationService.name);

  constructor(
    private readonly ddl: DDLService,
    private readonly parser: QueryParsingService,
  ) {}

  async generate(
    userRequest: string,
    connection: Connection,
  ): Promise<SQLQuery | InvalidQuery> {
    const ddlStatements = await this.ddl.retrieve(connection);

    const rawSQL = await b.GenerateSQL(userRequest, ddlStatements);
    this.logger.debug('Raw SQL', rawSQL);
    const preprocessedSQL = this.preprocess(rawSQL);
    const parsedSQL = this.parser.parse(preprocessedSQL);
    return parsedSQL;
  }

  private preprocess(text: string): string {
    const match = text.match(/```sql([\s\S]*?)```/);

    if (match) {
      return match[1].trim();
    } else {
      return text;
    }
  }
}
