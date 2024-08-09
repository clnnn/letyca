import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { FeatureFlagController } from './controller/feature-flag.controller';
import { DataLayerService } from './service/data-layer.service';
import { ChartController } from './controller/chart.controller';
import { ChartMetadataService } from './service/chart-metadata.service';
import { MergeService } from './service/merge.service';
import { QueryService } from './service/query.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, FeatureFlagController],
  providers: [
    PrismaService,
    DataLayerService,
    MergeService,
    ChartMetadataService,
    QueryService,
  ],
})
export class AppModule {}
