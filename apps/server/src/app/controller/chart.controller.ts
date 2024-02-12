import { Body, Controller, Post } from '@nestjs/common';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { ChartService } from '../service/chart.service';
import { DatabaseService } from '../service/database.service';

@Controller('charts')
export class ChartController {
  constructor(
    private prisma: PrismaService,
    private databaseMetadata: DatabaseService,
    private chartService: ChartService
  ) {}

  @Post()
  async generateChart(@Body() request: ChartRequest): Promise<ChartResponse> {
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: request.connectionId,
      },
    });

    const userRequest = request.userRequest;
    const database = await this.databaseMetadata.getDatabase(connection);
    const query = await this.databaseMetadata.generateQuery(
      await database.getTableInfo(),
      userRequest
    );
    const sqlResponse = await this.databaseMetadata.runQuery(query, database);
    const chart = await this.chartService.generateChart(
      sqlResponse,
      userRequest
    );
    return {
      chart: chart,
      sql: query,
    };
  }
}
