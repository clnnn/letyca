import { Injectable } from '@nestjs/common';
import { Connection, PrismaClient } from 'prisma/prisma-client';

export type RawData = { label?: string; value: bigint };

@Injectable()
export class DataLayerService {
  async runQuery(query: string, connection: Connection): Promise<RawData[]> {
    const client = await this.createPrismaClient(connection);
    const rawData = await client.$queryRawUnsafe<RawData[]>(query);
    await client.$disconnect();
    return rawData;
  }

  private async createPrismaClient(
    connection: Connection
  ): Promise<PrismaClient> {
    return new PrismaClient({
      datasourceUrl: `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`,
    });
  }
}
