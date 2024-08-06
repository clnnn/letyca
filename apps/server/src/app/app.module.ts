import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { ExecutionService } from './service/query/execution.service';
import { ChartController } from './controller/chart.controller';
import { Ollama } from 'ollama';
import { MetadataService } from './service/query/metadata.service';
import { QueryService } from './service/query/query.service';
import { ChartMetadataService } from './service/chart/chart-metadata.service';
import { MergeService } from './service/chart/merge.service';
import { LocalChartMetadataService } from './service/chart/local-chart-metadata.service';
import { LocalQueryService } from './service/query/local-query.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    ExecutionService,
    MergeService,
    MetadataService,
    {
      provide: Ollama,
      useValue: new Ollama({ host: process.env['OLLAMA_HOST'] }),
    },
    {
      provide: ChartMetadataService,
      useFactory: (ollama: Ollama) => new LocalChartMetadataService(ollama),
      inject: [Ollama],
    },
    {
      provide: QueryService,
      useFactory: (ollama: Ollama, metadata: MetadataService) =>
        new LocalQueryService(ollama, metadata),
      inject: [Ollama, MetadataService],
    },
  ],
})
export class AppModule {}
