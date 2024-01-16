import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommonsModule } from 'src/commons/commons.module';
import { Comment } from 'src/entities/Comment';
import { Restaurant } from 'src/entities/Restaurant';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [CommonsModule, MikroOrmModule.forFeature([Comment, Restaurant])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
