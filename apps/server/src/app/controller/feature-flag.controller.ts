import { FeatureFlagResponse } from '@letyca/contracts';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getFeatureFlags(): FeatureFlagResponse {
    const demoMode = this.configService.get<boolean>('DEMO_MODE');
    return { demoMode };
  }
}
