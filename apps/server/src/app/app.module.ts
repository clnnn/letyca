import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import OpenAI from 'openai';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { ExecutionService } from './service/query/execution.service';
import { ChartController } from './controller/chart.controller';
import { PhiQueryService } from './service/query/phi-query.service';
import { OpenAIQueryService } from './service/query/openai-query.service';
import { Ollama } from 'ollama';
import { MetadataService } from './service/query/metadata.service';
import { QueryService } from './service/query/query.service';
import { ChartMetadataService } from './service/chart/chart-metadata.service';
import { PhiChartMetadataService } from './service/chart/phi-chart-metadata.service';
import { OpenAIChartMetadataService } from './service/chart/openai-chart-metadata.service';
import { MergeService } from './service/chart/merge.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    ExecutionService,
    MergeService,
    MetadataService,
    {
      provide: ChartMetadataService,
      useFactory: () => {
        const ollamaHost = process.env['OLLAMA_HOST'];
        const openaiApiKey = process.env['OPENAI_API_KEY'];
        if (ollamaHost.length === 0 && openaiApiKey.length === 0) {
          throw new Error('Missing environment variables for Ollama/OpenAI');
        }

        if (ollamaHost.length > 0) {
          const llm = new Ollama({ host: ollamaHost });
          return new PhiChartMetadataService(llm);
        }

        if (openaiApiKey.length > 0) {
          const llm = new OpenAI({ apiKey: openaiApiKey });
          return new OpenAIChartMetadataService(llm);
        }
      },
    },
    {
      provide: QueryService,
      useFactory: (metadata: MetadataService) => {
        const ollamaHost = process.env['OLLAMA_HOST'];
        const openaiApiKey = process.env['OPENAI_API_KEY'];
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
