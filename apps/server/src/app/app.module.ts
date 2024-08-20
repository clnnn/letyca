import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './controller/connection.controller';
import { PrismaService } from './data-access/prisma.service';
import { DataLayerService } from './service/data-layer.service';
import { ChartController } from './controller/chart.controller';
import { ChartMetadataService } from './service/chart-metadata.service';
import { MergeService } from './service/merge.service';
import { QueryGenerationService } from './service/query-generation.service';
import { QueryParsingService } from './service/query-parsing.service';
import { DDLService } from './service/ddl.service';
import { SuggestionController } from './controller/suggestion.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController, ChartController, SuggestionController],
  providers: [
    PrismaService,
    DataLayerService,
    MergeService,
    ChartMetadataService,
    QueryGenerationService,
    QueryParsingService,
    DDLService,
  ],
})
export class AppModule {}
