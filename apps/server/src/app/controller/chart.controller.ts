import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GenerateChartRequest, GenerateChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { DataLayerService } from '../service/data-layer.service';
import { ChartMetadataService } from '../service/chart-metadata.service';
import { MergeService } from '../service/merge.service';
import { QueryGenerationService } from '../service/query-generation.service';

@Controller('charts')
export class ChartController {
  private readonly logger = new Logger(ChartController.name);

  constructor(
    private prisma: PrismaService,
    private metadataService: ChartMetadataService,
    private queryGenerationService: QueryGenerationService,
    private dataLayer: DataLayerService,
    private mergeService: MergeService,
  ) {}

  @Post()
  async generateChart(
    @Body() req: GenerateChartRequest,
  ): Promise<GenerateChartResponse> {
    const { connectionId, userRequest } = req;
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!connection) {
      throw new Error('Connection not found');
    }

    const [metadata, query] = await Promise.all([
      this.metadataService.generate(userRequest),
      this.queryGenerationService.generate(userRequest, connection),
    ]);
    this.logger.debug('Generated metadata', metadata);
    this.logger.debug('Generated SQL', query);

    if (query.type === 'invalidQuery') {
      throw new Error(query.errorMessage);
    }

    const result = await this.dataLayer.runQuery(query.rawSQL, connection);
    if (result.status === 'fail') {
      throw new Error(result.reason);
    }
    this.logger.log('Data result size', result.data.length);

    return {
      chart: this.mergeService.concat(metadata, result.data, query),
      query,
    };
  }
}
