import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConnectionMapper } from '../mapper/connection.mapper';
import { DataSource } from 'typeorm';
import { Connection } from '../../domain/connection.entity';

@Controller('connections')
export class ConnectionController {
  constructor(
    private mapper: ConnectionMapper,
    private dataSource: DataSource
  ) {}

  @Post()
  async create(@Body() dto: NewConnection): Promise<void> {
    const entity = this.mapper.toEntity(dto);
    await this.dataSource.transaction(async (manager) => {
      await manager.save(entity);
    });
  }

  @Get()
  async findAll(): Promise<ConnectionListItem[]> {
    const entities = await this.dataSource.manager.find(Connection);
    const list = this.mapper.toListItems(entities);
    return list;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(Connection, id);
    });
  }
}
