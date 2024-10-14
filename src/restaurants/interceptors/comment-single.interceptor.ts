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
export class CommentSingleInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;

    return next.handle().pipe(
      map((c: Comment) => {
        if (c.user?.avatar && !c.user.avatar.startsWith('http')) {
          c.user.avatar = baseUrl + c.user.avatar;
        }
        if (c.restaurant?.image && !c.restaurant.image.startsWith('http')) {
          c.restaurant.image = baseUrl + c.restaurant.image;
        }
        return { comment: c };
      }),
    );
  }
}
