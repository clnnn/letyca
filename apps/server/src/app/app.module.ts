import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { DataLayerService } from './service/data-layer.service';
import { ChartController } from './controller/chart.controller';
import { ChartMetadataService } from './service/chart-metadata.service';
import { MergeService } from './service/merge.service';
import { QueryGenerationService } from './service/query-generation.service';
import { QueryParsingService } from './service/query-parsing.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    DataLayerService,
    MergeService,
    ChartMetadataService,
    QueryGenerationService,
    QueryParsingService,
  ],
})
export class AppModule {}
