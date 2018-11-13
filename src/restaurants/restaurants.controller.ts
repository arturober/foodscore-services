import { Controller, Get, Post, Body, ValidationPipe, Delete, Param, ParseIntPipe, HttpException, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { InsertRestaurantDto } from './dto/insert-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'comments/comments.service';
import { InsertCommentDto } from 'comments/dto/insert-comment.dto';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
    constructor(private readonly restService: RestaurantsService, private readonly commentsService: CommentsService) { }

    @Get()
    async getAllRestaurants(@Req() req: any) {
        const restaurants = await this.restService.getAllRestaurants(req.user.id);
        return { restaurants };
    }

    @Get(':id')
    async getRestaurant(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        try {
            const restaurant = await this.restService.getRestaurant(id, req.user.id);
            return { restaurant };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Post()
    async insertRestaurant(
        @Req() req: any,
        @Body(new ValidationPipe({ transform: true })) restDto: InsertRestaurantDto,
    ) {
        restDto.creator = req.user.id;
        const restaurant = await this.restService.insertRestaurant(restDto);
        return { restaurant };
    }

    @Delete(':id')
    async deleteRestaurant(@Param('id', ParseIntPipe) id: number) {
        const result = await this.restService.deleteRestaurant(id);
        if (result.raw.affectedRows === 0) {
            throw new HttpException('Restaurant not found', 404);
        } else {
            return { id };
        }
    }

    @Get(':id/comments')
    async getComments(
        @Param('id', ParseIntPipe) restId: number,
    ) {
        return { comments: await this.commentsService.getComments(restId) };
    }

    @Post(':id/comments')
    async postComment(
        @Req() req: any,
        @Param('id', ParseIntPipe) restId: number,
        @Body(new ValidationPipe({ transform: true })) comDto: InsertCommentDto
    ) {
        comDto.user = req.user.id;
        comDto.restaurant = restId;
        const comment = await this.commentsService.insertComment(comDto);
        return { comment: await this.commentsService.getComment(comment.id) };
    }
}