import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './application/controller/connection.controller';
import { PrismaService } from './application/data-access/prisma.service';
import { ChartController } from './application/controller/chart.controller';
import { ChartService } from './domain/chart.service';
import OpenAI from 'openai';
import { DatabaseService } from './domain/database.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController],
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
