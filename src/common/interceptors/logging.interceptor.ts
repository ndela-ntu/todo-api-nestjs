import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const { method, url, user } = request;
      const userInfo = user ? `User: ${user.email} ${user.role}` : 'Anonymous';

      this.logger.log(`${method} ${url} - ${userInfo}`);

      const now = Date.now();
      return next.handle().pipe(tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} - ${userInfo} - ${responseTime}ms`)
      }))
  }
}
