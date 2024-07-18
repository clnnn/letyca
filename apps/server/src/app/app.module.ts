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
import { MergeService } from './service/chart/merge.service';
import { LocalChartMetadataService } from './service/chart/local-chart-metadata.service';

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
        return new LocalChartMetadataService(new Ollama({ host: ollamaHost }));
      },
    },
    {
      provide: QueryService,
      useFactory: () => {
        const openaiApiKey = process.env['OPENAI_API_KEY'];
        return new OpenAIQueryService(new OpenAI({ apiKey: openaiApiKey }));
      },
    },
  ],
})
export class AppModule {}
