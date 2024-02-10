import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    const isDemoModeEnabled = Boolean(process.env['DEMO_MODE'] ?? false);
    if (isDemoModeEnabled) {
      this.createDemoData();
    }
  }

  private async createDemoData() {
    const northwindCount = await this.connection.count({
      where: { host: 'northwind', port: 5432 },
    });
    if (northwindCount === 0) {
      await this.connection.create({
        data: {
          host: 'northwind',
          port: 5432,
          database: 'northwind',
          schema: 'public',
          username: 'postgres',
          password: 'postgres',
        },
      });
    }
  }
}
