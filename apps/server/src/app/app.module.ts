import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './domain/connection.entity';
import { ConnectionController } from './application/controller/connection.controller';
import { ConnectionMapper } from './application/mapper/connection.mapper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [Connection],
    }),
  ],
  controllers: [ConnectionController],
  providers: [ConnectionMapper],
})
export class AppModule {}
