import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { User } from 'src/entities/User';

@Injectable()
export class UserListInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;

    return next.handle().pipe(
      map((users: User[]) => {
        return {
          users: users.map((u) => {
            u.avatar = u.avatar && baseUrl + u.avatar;
            u.me = u.id === req.user.id;
            return u;
          }),
        };
      })
    );
  }
}
