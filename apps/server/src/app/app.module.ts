import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './application/controller/connection.controller';
import { PrismaService } from './application/data-access/prisma.service';
import { ChartController } from './application/controller/chart.controller';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChartService } from './domain/chart.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController],
  providers: [
    PrismaService,
    ChartService,
    {
      provide: ChatOpenAI,
      useValue: new ChatOpenAI({
        openAIApiKey: process.env['OPEN_AI_API_KEY'],
      }),
    },
  ],
})
export class AppModule {}
