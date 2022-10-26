import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from 'src/entities/Comment';
import { Restaurant } from 'src/entities/Restaurant';
import { User } from 'src/entities/User';
import { InsertCommentDto } from './dto/insert-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: EntityRepository<Comment>,
    @InjectRepository(Restaurant)
    private readonly restRepo: EntityRepository<Restaurant>,
  ) {}

  async insertComment(
    commentDto: InsertCommentDto,
    authUser: User,
    restId: number,
  ): Promise<Comment> {
    const comment = Comment.fromCreateDto(commentDto);
    comment.user = authUser;
    comment.restaurant = await this.restRepo.findOne(restId);
    if (!comment.restaurant) {
      throw new NotFoundException({
        status: 404,
        error: 'Restaurant not found',
      });
    }
    await this.commentRepo.persistAndFlush(comment);
    return comment;
  }

  getComment(commentId: number): Promise<Comment> {
    return this.commentRepo.findOne(commentId, { populate: ['user'] });
  }

  getComments(restId: number): Promise<Comment[]> {
    return this.commentRepo.find(
      { restaurant: restId },
      { populate: ['user'] },
    );
  }
}
