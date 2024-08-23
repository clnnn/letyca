import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';
import { b } from 'baml_client';
import { DDLService } from '../service/ddl.service';
import { GetSuggestionResponse } from '@letyca/contracts';

@Controller('suggestions')
export class SuggestionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ddl: DDLService,
  ) {}

  @Get()
  async get(
    @Query('connectionId') connectionId?: string,
  ): Promise<GetSuggestionResponse> {
    if (!connectionId) {
      throw new Error('Connection ID is required');
    }

    const connection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!connection) {
      throw new Error('Connection not found');
    }

    const ddl = await this.ddl.retrieve(connection);
    const suggestion = await (await b.GetSuggestionsByDDL(ddl)).suggestions[0];
    return {
      suggestion,
    };
  }
}
