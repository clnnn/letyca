import { Body, Controller, Post } from '@nestjs/common';
import { GenerateChartRequest, GenerateChartResponse } from '@letyca/contracts';
import { PrismaService } from '../data-access/prisma.service';
import { DataLayerService } from '../service/data-layer.service';
import { ChartMetadataService } from '../service/chart-metadata.service';
import { MergeService } from '../service/merge.service';
import { QueryService } from '../service/query.service';
import { ChartType } from 'baml_client';

@Controller('charts')
export class ChartController {
  constructor(
    private prisma: PrismaService,
    private metadataService: ChartMetadataService,
    private queryService: QueryService,
    private dataLayer: DataLayerService,
    private mergeService: MergeService
  ) {}

  @Post()
  async generateChart(
    @Body() request: GenerateChartRequest
  ): Promise<GenerateChartResponse> {
    const { connectionId, userRequest } = request;
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    const metadata = await this.metadataService.generate(userRequest);
    console.log(metadata);

    const sql = await this.queryService.generate(userRequest, connection);
    console.log(sql);

    const result = await this.dataLayer.runQuery(sql, connection);
    const chart = this.mergeService.concat(metadata, result);

    return {
      chart: {
        ...chart,
        chartType: this.asUnion(chart.chartType),
      },
      sql,
    };
  }

  private asUnion(chartType: ChartType): 'countLabel' | 'pie' | 'line' | 'bar' {
    switch (chartType) {
      case ChartType.CountLabel:
        return 'countLabel';
      case ChartType.Pie:
        return 'pie';
      case ChartType.Line:
        return 'line';
      case ChartType.Bar:
        return 'bar';
    }
  }
}
