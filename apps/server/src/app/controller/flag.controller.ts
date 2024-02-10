import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('flags')
export class FlagController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getFlags(): Record<string, boolean> {
    const demoMode = this.configService.get<boolean>('DEMO_MODE');
    return { demoMode };
  }
}
