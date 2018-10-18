import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'entities/restaurant.entity';
import { Repository } from 'typeorm';
import { InsertRestaurantDto } from './dto/insert-restaurant.dto';
import { Comment } from 'entities/comment.entity';
import { ImageService } from 'commons/image.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant) private readonly restRepo: Repository<Restaurant>,
        @InjectRepository(Comment) private readonly comRepo: Repository<Comment>,
        private readonly imageService: ImageService,
        private readonly usersService: UsersService
    ) {}

    async getAllRestaurants(userId: number): Promise<Restaurant[]> {
        const user = await this.usersService.getUser(userId);
        let rests = await this.restRepo.createQueryBuilder('restaurant')
            .addSelect('haversine(restaurant.lat, restaurant.lng, :userLat, :userLng)', 'distance')
            .setParameter('userLat', user.lat)
            .setParameter('userLng', user.lng)
            .loadRelationIdAndMap('restaurant.creator', 'restaurant.creator')
            .orderBy('distance')
            .getRawAndEntities();
        return rests.entities.map((r, i) => {
            (<any>r).mine = +r.creator === userId;
            (<any>r).distance = rests.raw[i].distance;
            delete r.creator;
            return r;
        });
    }

    async getRestaurant(restId: number, userId: number) {
        let rest = await this.restRepo.findOne(restId, {relations: ['creator']});
        (<any>rest).mine = rest.creator.id === userId;
        (<any>rest).commented = await this.comRepo.findOne({where: {user: userId, restaurant: rest.id}})? true: false;
        return rest;
    }

    async insertRestaurant(restaurant: InsertRestaurantDto) {
        restaurant.image = await this.imageService.saveImage('restaurants', restaurant.image);
        restaurant.cuisine = restaurant.cuisine.map(c => c.trim());
        return await this.restRepo.save(restaurant);
    }

    deleteRestaurant(id: number) {
        return this.restRepo.delete(id);
    }
}
