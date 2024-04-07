import { Injectable } from '@nestjs/common';
import { Connection, PrismaClient } from 'prisma/prisma-client';

type ExecutionResult =
  | { value: number }
  | { labels: string[]; values: number[] };

@Injectable()
export class ExecutionService {
  async runQuery(
    query: string,
    connection: Connection
  ): Promise<ExecutionResult[]> {
    const client = await this.createPrismaClient(connection);
    return client.$queryRawUnsafe<ExecutionResult[]>(query);
  }

  private async createPrismaClient(
    connection: Connection
  ): Promise<PrismaClient> {
    return new PrismaClient({
      datasourceUrl: `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`,
    });
  }
}
