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
    this.logger.debug('Generated metadata', metadata);

    if (!connection) {
      throw new Error('Connection not found');
    }

    const rawSql = await this.queryGenerationService.generate(
      userRequest,
      connection,
    );
    this.logger.debug('Generated SQL', rawSql);

    const query = this.queryParsingService.parse(rawSql);
    this.logger.debug('Parsed SQL', query);

    if ('message' in query) {
      throw new Error(query.message);
    }

    const result = await this.dataLayer.runQuery(query.rawSQL, connection);
    this.logger.debug('Data result', result);

    const chart = this.mergeService.concat(metadata, result, query);
    this.logger.debug('Generated chart', chart);

    return {
      chart,
      sql: rawSql,
    };
  }
}
