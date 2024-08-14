import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GenerateChartRequest, GenerateChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { DataLayerService } from '../service/data-layer.service';
import { ChartMetadataService } from '../service/chart-metadata.service';
import { MergeService } from '../service/merge.service';
import { QueryGenerationService } from '../service/query-generation.service';
import { QueryParsingService } from '../service/query-parsing.service';

@Controller('charts')
export class ChartController {
  private readonly logger = new Logger(ChartController.name);

  constructor(
    private prisma: PrismaService,
    private metadataService: ChartMetadataService,
    private queryGenerationService: QueryGenerationService,
    private queryParsingService: QueryParsingService,
    private dataLayer: DataLayerService,
    private mergeService: MergeService,
  ) {}

  @Post()
  async generateChart(
    @Body() request: GenerateChartRequest,
  ): Promise<GenerateChartResponse> {
    const { connectionId, userRequest } = request;
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    const metadata = await this.metadataService.generate(userRequest);
    this.logger.log('Generated metadata', metadata);

    const rawSql = await this.queryGenerationService.generate(
      userRequest,
      connection,
    );
    this.logger.log('Generated SQL', rawSql);

    const sqlQuery = this.queryParsingService.parse(rawSql);
    this.logger.debug('Parsed SQL', sqlQuery);

    const result = await this.dataLayer.runQuery(sqlQuery, connection);
    this.logger.debug('Got result', result);

    const chart = this.mergeService.concat(metadata, result);
    this.logger.debug('Generated chart', chart);

    return {
      chart: {
        chartType: 'countLabel',
        data: 1,
        title: 'Count',
      },
      sql: rawSql,
    };
  }
}
