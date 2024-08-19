import { Injectable } from '@nestjs/common';
import { Connection, Prisma, PrismaClient } from 'prisma/prisma-client';

export type Row = {
  [key: string]: string | number | bigint;
};

export type QueryExecuted = {
  status: 'success';
  data: Row[];
};

export type QueryNotExecuted = {
  status: 'fail';
  reason: string;
};

export type QueryResult = QueryExecuted | QueryNotExecuted;

@Injectable()
export class DataLayerService {
  async runQuery(rawSQL: string, connection: Connection): Promise<QueryResult> {
    const client = await this.createPrismaClient(connection);
    try {
      const rawData = await client.$queryRawUnsafe<Row[]>(rawSQL);
      return { status: 'success', data: rawData };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        return { status: 'fail', reason: e.message };
      } else {
        return {
          status: 'fail',
          reason: 'Unknown error while executing the SQL query',
        };
      }
    } finally {
      await client.$disconnect();
    }
  }

  private async createPrismaClient(
    connection: Connection,
  ): Promise<PrismaClient> {
    return new PrismaClient({
      datasourceUrl: `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`,
    });
  }
}
