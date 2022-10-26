import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { CommentsService } from 'src/comments/comments.service';
import { InsertCommentDto } from 'src/comments/dto/insert-comment.dto';
import { Restaurant } from 'src/entities/Restaurant';
import { User } from 'src/entities/User';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CommentListInterceptor } from './interceptors/comment-list.interceptor';
import { CommentSingleInterceptor } from './interceptors/comment-single.interceptor';
import { RestaurantListInterceptor } from './interceptors/restaurant-list.interceptor';
import { RestaurantSingleInterceptor } from './interceptors/restaurant-single.interceptor';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  @UseInterceptors(RestaurantListInterceptor)
  findAll(@AuthUser() authUser: User): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(authUser);
  }

  @Get('mine')
  @UseInterceptors(RestaurantListInterceptor)
  findMine(@AuthUser() authUser: User): Promise<Restaurant[]> {
    return this.restaurantsService.findByUser(authUser.id, authUser);
  }

  @Get('user/:id')
  @UseInterceptors(RestaurantListInterceptor)
  findByUser(
    @Param('id', ParseIntPipe) idUser: number,
    @AuthUser() authUser: User,
  ): Promise<Restaurant[]> {
    return this.restaurantsService.findByUser(idUser, authUser);
  }

  @Get(':id')
  @UseInterceptors(RestaurantSingleInterceptor)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.findOne(id, authUser);
  }

  @Post()
  @UseInterceptors(RestaurantSingleInterceptor)
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createRestaurantDto: CreateRestaurantDto,
    @AuthUser() authUser: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurantDto, authUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() authUser: User,
  ): Promise<void> {
    return this.restaurantsService.remove(id, authUser);
  }

  @Get(':id/comments')
  @UseInterceptors(CommentListInterceptor)
  async getComments(@Param('id', ParseIntPipe) restId: number) {
    return this.commentsService.getComments(restId);
  }

  @Post(':id/comments')
  @UseInterceptors(CommentSingleInterceptor)
  async postComment(
    @AuthUser() authUser: User,
    @Param('id', ParseIntPipe) restId: number,
    @Body(new ValidationPipe({ transform: true })) comDto: InsertCommentDto,
  ) {
    try {
      const comment = await this.commentsService.insertComment(
        comDto,
        authUser,
        restId,
      );
      return comment;
    } catch (e) {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Only one comment allowed per user and restaurant',
          400,
        );
      } else {
        throw e;
      }
    }
  }
}
