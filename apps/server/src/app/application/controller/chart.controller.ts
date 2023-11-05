import { Body, Controller, Post } from '@nestjs/common';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { ChartService } from '../../domain/chart.service';
import { PrismaService } from '../data-access/prisma.service';

@Controller('charts')
export class ChartController {
  constructor(private prisma: PrismaService, private service: ChartService) {}

  @Post()
  async generateChart(@Body() request: ChartRequest): Promise<ChartResponse> {
    const connection = await this.prisma.connection.findUnique({
      where: {
        id: request.connectionId,
      },
    });

    return await this.service.generate(request.query, connection);
  }
}
