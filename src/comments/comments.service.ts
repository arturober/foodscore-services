import { Injectable } from '@nestjs/common';
import { InsertCommentDto } from './dto/insert-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { PushService } from '../commons/push/push/push.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private readonly comRepo: Repository<Comment>,
        @InjectRepository(Restaurant) private readonly restRepo: Repository<Restaurant>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly pushService: PushService,
    ) {}

    async insertComment(comment: InsertCommentDto): Promise<any> {
        const result = await this.comRepo.insert(comment);
        const rest = await this.restRepo.findOne(comment.restaurant, {loadRelationIds: true});
        const user = await this.userRepo.findOne(rest.creator);
        if (user.oneSignalId) {
            this.pushService.sendMessage(user.oneSignalId, `New comment (${rest.name})`, comment.text, {restId: '' + rest.id});
        }
        return await this.comRepo.findOne(result.identifiers[0], {relations: ['user']});
    }

    getComment(commentId: number): Promise<Comment> {
        return this.comRepo.findOne(commentId, {relations: ['user']});
    }

    getComments(restId: number): Promise<Comment[]> {
        return this.comRepo.find({where: {restaurant: restId}, relations: ['user']});
    }
}
