import {
  GetConnectionsResponse,
  CreateConnectionRequest,
} from '@letyca/contracts';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() req: CreateConnectionRequest): Promise<void> {
    await this.prisma.connection.create({ data: req });
  }

  @Get()
  async findAll(): Promise<GetConnectionsResponse> {
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
