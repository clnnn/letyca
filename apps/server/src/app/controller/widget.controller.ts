import {
  CreateWidgetRequest,
  CreateWidgetResponse,
  GetWidgetsResponse,
} from '@letyca/contracts';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';

@Controller('widgets')
export class WidgetController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async create(
    @Body() req: CreateWidgetRequest,
    @Query('connectionId') connectionId?: string,
  ): Promise<CreateWidgetResponse> {
    if (req.chartType === 'unknown') {
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
        name: req.title,
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
}
