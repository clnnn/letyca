import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DemoModeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isDemoModeEnabled = Boolean(process.env['DEMO_MODE'] ?? false);

    if (isDemoModeEnabled) {
      throw new BadRequestException(
        'Demo mode is enabled. This action is not allowed.'
      );
    }

    return next.handle();
  }
}
