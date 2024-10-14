import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { Comment } from 'src/entities/Comment';

@Injectable()
export class CommentListInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`; 
    
    return next.handle().pipe(
      map((comments: Comment[]) => {
        return {
          comments: comments.map((c) => {
            if (c.user?.avatar && !c.user.avatar.startsWith('http')) {
              c.user.avatar = baseUrl + c.user.avatar;
            }
            return c;
          }),
        };
      }),
    );
  }
}
