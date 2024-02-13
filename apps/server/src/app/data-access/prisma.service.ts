import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();

    const demoMode = this.configService.get<string>('DEMO_MODE');
    if (demoMode === 'true') {
      this.createNorthwindConnection();
    }
  }

  private async createNorthwindConnection() {
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
