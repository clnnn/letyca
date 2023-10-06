import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { Connection } from '../../domain/connection.entity';

@Injectable()
export class ConnectionMapper {
  toEntity(dto: NewConnection): Connection {
    console.log(dto);
    const entity = new Connection();
    entity.host = dto.host;
    entity.port = dto.port;
    entity.database = dto.database;
    entity.schema = dto.schema;
    entity.username = dto.username;
    entity.password = dto.password;
    return entity;
  }

  toListItems(entity: Connection[]): ConnectionListItem[] {
    return entity.map((entity) => ({
      id: entity.id,
      host: entity.host,
      port: entity.port,
      database: entity.database,
      schema: entity.schema,
    }));
  }
}
