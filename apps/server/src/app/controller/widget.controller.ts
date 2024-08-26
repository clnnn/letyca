import {
  CreateWidgetRequest,
  CreateWidgetResponse,
  GetWidgetsResponse,
  SQLQuery,
} from '@letyca/contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';
import { DataLayerService } from '../service/data-layer.service';
import { MergeService } from '../service/merge.service';
import { Request } from 'express';

@Controller('widgets')
export class WidgetController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataLayer: DataLayerService,
    private readonly mergeService: MergeService,
  ) {}

  @Post()
  async create(
    @Body() req: CreateWidgetRequest,
    @Query('connectionId') connectionId?: string,
  ): Promise<CreateWidgetResponse> {
    const { chartMetadata, query } = req;
    if (chartMetadata.chartType === 'unknown') {
      throw new Error('Unknown chart cannot be saved');
    }

    if (!connectionId) {
      throw new Error('Connection ID is required');
    }

    const connection = await this.prismaService.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Connection not found');
    }

    const result = await this.prismaService.widget.create({
      data: {
        name: chartMetadata.title,
        connectionId,
        data: JSON.stringify(req),
      },
    });

    return result;
  }

  @Get()
  async findAll(): Promise<GetWidgetsResponse> {
    const widgets = await this.prismaService.widget.findMany();
    return {
      widgets: widgets.map((w) => ({
        id: w.id,
        name: w.name,
        connectionId: w.connectionId,
        type: JSON.parse(w.data as unknown as string).chartType,
      })),
    };
  }

  @Delete()
  async delete(@Query('id') id: string): Promise<void> {
    await this.prismaService.widget.delete({ where: { id } });
  }

  @Get(':id')
  @Render('widget')
  async getWidgetHTML(@Param('id') id: string) {
    const widget = await this.prismaService.widget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new Error('Widget not found');
    }

    const connection = await this.prismaService.connection.findUnique({
      where: { id: widget.connectionId },
    });

    if (!connection) {
      throw new Error('Connection not found');
    }

    const {
      chartMetadata: { title, chartType },
      query,
    } = JSON.parse(widget.data as unknown as string) as CreateWidgetRequest;

    const result = await this.dataLayer.runQuery(query.rawSQL, connection);
    if (result.status !== 'success') {
      throw new Error('Query failed');
    }

    if (chartType === 'unknown') {
      throw new Error('Unknown chart type');
    }

    const chart = this.mergeService.concat(
      { title, chartType },
      result.data,
      query,
    );

    if (chart.chartType === 'unknown') {
      throw new Error('Unknown chart type');
    }

    return { title, chartType, data: JSON.stringify(chart.data) };
  }

  @Get(':id/embedded')
  getEmbeddedChart(@Param('id') id: string, @Req() req: Request): string {
    const url = `${req.protocol}://${req.get('host')}/api/widgets/${id}`;
    return `<iframe src="${url}" />`;
  }
}
