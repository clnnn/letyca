import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import OpenAI from 'openai';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { QueryService } from './service/query.service';
import { ChartService } from './service/chart.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { ExecutionService } from './service/execution.service';
import { ChartController } from './controller/chart.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    QueryService,
    ExecutionService,
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
