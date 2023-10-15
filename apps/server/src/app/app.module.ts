import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConnectionController } from './application/controller/connection.controller';
import { PrismaService } from './application/data-access/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConnectionController],
  providers: [PrismaService],
})
export class AppModule {}
