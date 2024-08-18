import { Injectable } from '@nestjs/common';
import { b } from 'baml_client';
import { Connection } from 'prisma/prisma-client';
import { DDLService } from './ddl.service';

@Injectable()
export class SuggestionService {
  constructor(private readonly ddl: DDLService) {}

  async byConnection(connection: Connection): Promise<string[]> {
    const ddl = await this.ddl.retrieve(connection);
    const result = await b.GetSuggestionsByDDL(ddl);
    return result.suggestions;
  }
}
