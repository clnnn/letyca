import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import OpenAI from 'openai';
import { ConnectionController } from './controller/connection.controller';
import { ChartController } from './controller/chart.controller';
import { PrismaService } from './data-access/prisma.service';
import { DatabaseService } from './service/database.service';
import { ChartService } from './service/chart.service';
import { FeatureFlagController } from './controller/feature-flag.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    DatabaseService,
    ChartService,
    {
      provide: OpenAI,
      useValue: new OpenAI({
        apiKey: process.env['OPEN_AI_API_KEY'],
      }),
    },
  ],
})
export class AppModule {}
