import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class DemoModeInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const demoMode = this.configService.get<string>('DEMO_MODE');
    if (demoMode === 'true') {
      throw new BadRequestException(
        'Demo mode is enabled. This action is not allowed.'
      );
    }

    return next.handle();
  }
}
