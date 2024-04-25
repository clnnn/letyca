import { Connection } from 'prisma/prisma-client';

export abstract class QueryService {
  async translate(
    userRequest: string,
    connection: Connection
  ): Promise<string> {
    const metadata = await this.metadata(connection);
    const sqlQuery = await this.chatResponse(userRequest, metadata);
    return sqlQuery;
  }

  protected abstract metadata(connection: Connection): Promise<string>;

  protected abstract chatResponse(
    userRequest: string,
    metadata: string
  ): Promise<string>;
}
