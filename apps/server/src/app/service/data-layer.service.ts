import { Injectable } from '@nestjs/common';
import { Connection, PrismaClient } from 'prisma/prisma-client';
import { AggregationSQLQuery } from './query-parsing.service';

export type Row = {
  [key: string]: string | number;
};

@Injectable()
export class DataLayerService {
  async runQuery(
    query: AggregationSQLQuery,
    connection: Connection,
  ): Promise<Row[]> {
    const client = await this.createPrismaClient(connection);
    const rawData = await client.$queryRawUnsafe<Row[]>(query.rawSQL);
    await client.$disconnect();
    return rawData;
  }

  private async createPrismaClient(
    connection: Connection,
  ): Promise<PrismaClient> {
    return new PrismaClient({
      datasourceUrl: `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`,
    });
  }
}
