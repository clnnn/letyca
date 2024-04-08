import { Body, Controller, Post } from '@nestjs/common';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { ChartService } from '../service/chart.service';
import { QueryService } from '../service/query.service';
import { ExecutionService } from '../service/execution.service';

@Controller('charts')
export class ChartController {
  constructor(
    private prisma: PrismaService,
    private queryService: QueryService,
    private executionService: ExecutionService,
    private chartService: ChartService
  ) {}

  @Post()
  async generateChart(@Body() request: ChartRequest): Promise<ChartResponse> {
    const { connectionId, userRequest } = request;
    const conn = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });
    const query = await this.queryService.generate(userRequest, conn);
    const result = await this.executionService.runQuery(query, conn);
    const chart = await this.chartService.generateChart(result, userRequest);
    return {
      chart: chart,
      sql: query,
    };
  }
}
