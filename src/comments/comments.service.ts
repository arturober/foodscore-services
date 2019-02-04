import { Injectable } from '@nestjs/common';
import { InsertCommentDto } from './dto/insert-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) private readonly comRepo: Repository<Comment>) {}

    insertComment(comment: InsertCommentDto): Promise<any> {
        return this.comRepo.save(comment);
    }

    getComment(commentId: number): Promise<Comment> {
        return this.comRepo.findOne(commentId, {relations: ['user']});
    }

    getComments(restId: number): Promise<Comment[]> {
        return this.comRepo.find({where: {restaurant: restId}, relations: ['user']});
    }
}
