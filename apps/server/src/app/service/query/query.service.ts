import { Connection } from 'prisma/prisma-client';
import { QueryResponse } from './query-response.model';

export abstract class QueryService {
  abstract translate(
    userRequest: string,
    connection: Connection
  ): Promise<QueryResponse>;
}
