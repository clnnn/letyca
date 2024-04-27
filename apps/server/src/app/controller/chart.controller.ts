import { Body, Controller, Post } from '@nestjs/common';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { ExecutionService } from '../service/query/execution.service';
import { QueryService } from '../service/query/query.service';
import { ChartMetadataService } from '../service/chart/chart-metadata.service';
import { MergeService } from '../service/chart/merge.service';

@Controller('charts')
export class ChartController {
  constructor(
    private prisma: PrismaService,
    private queryService: QueryService,
    private executionService: ExecutionService,
    private mergeService: MergeService,
    private chartMetadataService: ChartMetadataService
  ) {}

  @Post()
  async generateChart(@Body() request: ChartRequest): Promise<ChartResponse> {
    const { connectionId, userRequest } = request;
    const conn = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    const translation = await this.queryService.translate(userRequest, conn);
    const sql = translation.sqlQuery;
    const result = await this.executionService.runQuery(sql, conn);

    const metadata = await this.chartMetadataService.generate(userRequest);
    const chart = this.mergeService.concat(metadata, result);

    return {
      chart,
      sql,
    };
  }
}
