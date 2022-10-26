import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommentsModule } from 'src/comments/comments.module';
import { CommonsModule } from 'src/commons/commons.module';
import { Restaurant } from 'src/entities/Restaurant';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    CommonsModule,
    CommentsModule,
    MikroOrmModule.forFeature([Restaurant]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
