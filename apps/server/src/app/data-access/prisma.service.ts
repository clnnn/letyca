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
    await this.connection.deleteMany({ where: { host: 'northwind' } });
    await this.connection.create({
      data: {
        host: 'northwind',
        port: 5432,
        database: 'northwind',
        schema: 'public',
        username: 'postgres',
        password: 'postgres',
        QueryExample: {
          createMany: {
            data: [
              {
                name: 'Total number of products',
                query: 'Total number of products',
              },
              {
                name: 'Total number of products by type',
                query:
                  'Please display the number of total products by types in a pie chart',
              },
            ],
          },
        },
      },
    });
  }
}
