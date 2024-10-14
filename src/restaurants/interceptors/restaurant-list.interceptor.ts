import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { Restaurant } from 'src/entities/Restaurant';

@Injectable()
export class RestaurantListInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = `${this.configService.get<string>('protocol')}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`; 
    
    return next.handle().pipe(
      map((restaurants: Restaurant[]) => {
        return {
          restaurants: restaurants.map((r) => {
            r.image = r.image && baseUrl + r.image;
            r.mine = r.creator.id === req.user.id;
            if (r.creator?.avatar && !r.creator.avatar.startsWith('http')) {
              r.creator.avatar = baseUrl + r.creator.avatar;
            }
            return r;
          }),
        };
      }),
    );
  }
}
