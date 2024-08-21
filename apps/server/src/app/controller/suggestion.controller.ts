import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';
import { b } from 'baml_client';
import { DDLService } from '../service/ddl.service';

@Controller('suggestions')
export class SuggestionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ddl: DDLService,
  ) {}

  @Get()
  async getAll(
    @Query('connectionId') connectionId?: string,
    @Query('userRequest') userRequest?: string,
  ): Promise<string[]> {
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

    if (!userRequest) {
      const ddl = await this.ddl.retrieve(connection);
      return (await b.GetSuggestionsByDDL(ddl)).suggestions;
    } else {
      // not implemented yet
      return [];
    }
  }
}
