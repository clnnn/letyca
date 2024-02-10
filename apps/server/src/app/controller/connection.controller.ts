import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';
import { DemoModeInterceptor } from '../interceptor/demo-mode.interceptor';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseInterceptors(DemoModeInterceptor)
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
  @UseInterceptors(DemoModeInterceptor)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.prisma.connection.delete({
      where: {
        id,
      },
    });
  }
}
