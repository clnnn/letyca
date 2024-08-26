import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionManagementInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const isConnectionManagementEnabled =
      this.config.get<string>('CONNECTION_MANAGEMENT') === 'ENABLED'
        ? true
        : false;
    if (!isConnectionManagementEnabled) {
      throw new BadRequestException('This action is not allowed.');
    }

    return next.handle();
  }
}
