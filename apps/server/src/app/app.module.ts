import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import OpenAI from 'openai';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { ChartService } from './service/chart.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { ExecutionService } from './service/execution.service';
import { ChartController } from './controller/chart.controller';
import { PhiQueryService } from './service/query/phi-query.service';
import { OpenAIQueryService } from './service/query/openai-query.service';
import { Ollama } from 'ollama';
import { MetadataService } from './service/query/metadata.service';
import { QueryService } from './service/query/query.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    ExecutionService,
    ChartService,
    {
      // TODO: After ChartService is implemented using Ollama, we can remove this provider
      provide: OpenAI,
      useValue: new OpenAI({ apiKey: process.env['OPEN_AI_API_KEY'] }),
    },
    MetadataService,
    {
      provide: QueryService,
      useFactory: (metadata: MetadataService) => {
        const ollamaHost = process.env['OLLAMA_HOST'];
        const openaiApiKey = process.env['OPEN_AI_API_KEY'];
        if (ollamaHost.length === 0 && openaiApiKey.length === 0) {
          throw new Error('Missing environment variables for Ollama/OpenAI');
        }

        if (ollamaHost.length > 0) {
          const llm = new Ollama({ host: ollamaHost });
          return new PhiQueryService(llm, metadata);
        }

        if (openaiApiKey.length > 0) {
          const llm = new OpenAI({ apiKey: openaiApiKey });
          return new OpenAIQueryService(llm);
        }
      },
      inject: [MetadataService],
    },
  ],
})
export class AppModule {}
