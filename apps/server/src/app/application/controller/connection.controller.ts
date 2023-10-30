import {
  ChartResponse,
  ConnectionListItem,
  NewConnection,
} from '@letyca/contracts';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';
import { ChartService } from '../../domain/chart.service';

@Controller('connections')
export class ConnectionController {
  constructor(
    private prisma: PrismaService,
    private chartService: ChartService
  ) {}

  @Post()
  async create(@Body() newConnection: NewConnection): Promise<void> {
    await this.prisma.connection.create({ data: newConnection });
  }

  @Get()
  async findAll(): Promise<ConnectionListItem[]> {
    return await this.prisma.connection.findMany({
      select: {
        id: true,
        host: true,
        port: true,
        database: true,
        schema: true,
      },
    });
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.prisma.connection.delete({
      where: {
        id,
      },
    });
  }
}
