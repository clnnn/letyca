import { RawData } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { Connection, PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class ExecutionService {
  async runQuery(query: string, connection: Connection): Promise<RawData[]> {
    const client = await this.createPrismaClient(connection);
    return client.$queryRawUnsafe<RawData[]>(query);
  }

  private async createPrismaClient(
    connection: Connection
  ): Promise<PrismaClient> {
    return new PrismaClient({
      datasourceUrl: `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`,
    });
  }
}
