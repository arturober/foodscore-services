import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InsertRestaurantDto } from './dto/insert-restaurant.dto';
import { Comment } from '../entities/comment.entity';
import { ImageService } from '../commons/image.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant) private readonly restRepo: Repository<Restaurant>,
        @InjectRepository(Comment) private readonly comRepo: Repository<Comment>,
        private readonly imageService: ImageService,
        private readonly usersService: UsersService,
    ) {}

    private async getRestaurantsSelect(userId: number) {
        const user = await this.usersService.getUser(userId);
        return this.restRepo.createQueryBuilder('restaurant')
            .addSelect('haversine(restaurant.lat, restaurant.lng, :userLat, :userLng)', 'distance')
            .setParameter('userLat', user.lat)
            .setParameter('userLng', user.lng);
    }

    private async getRestaurants(userId: number, selectQuery: SelectQueryBuilder<Restaurant>): Promise<Restaurant[]> {
        const rests = await selectQuery.loadRelationIdAndMap('restaurant.creator', 'restaurant.creator')
            .orderBy('distance')
            .getRawAndEntities();
        return rests.entities.map((r, i) => {
            (r as any).mine = +r.creator === userId;
            (r as any).distance = rests.raw[i].distance || 0;
            delete r.creator;
            return r;
        });
    }

    async getAllRestaurants(userId: number): Promise<Restaurant[]> {
        const select = await this.getRestaurantsSelect(userId);
        return await this.getRestaurants(userId, select);
    }

    async getMyRestaurants(userId: number) {
        const select = (await this.getRestaurantsSelect(userId))
            .where('restaurant.creator = :id', { id : userId });
        return this.getRestaurants(userId, select);
    }

    async getUserRestaurants(userId: number, loggedId: number) {
        const select = (await this.getRestaurantsSelect(userId))
            .where('restaurant.creator = :id', { id : userId });
        return this.getRestaurants(loggedId, select);
    }

    async getRestaurant(restId: number, userId: number) {
        const user = await this.usersService.getUser(userId);
        let rest = null;
        rest = await this.restRepo.createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.creator', 'user')
        .where('restaurant.id = ' + restId)
        .addSelect('haversine(restaurant.lat, restaurant.lng, :userLat, :userLng)', 'distance')
        .setParameter('userLat', user.lat)
        .setParameter('userLng', user.lng)
        .loadRelationIdAndMap('restaurant.creator', 'restaurant.creator')
        .getRawAndEntities();

        const restEnt: Restaurant = rest.entities[0];
        (restEnt as any).commented = await this.comRepo.findOne({where: {user: userId, restaurant: restEnt.id}}) ? true : false;
        (restEnt as any).distance = rest.raw[0].distance || 0;
        restEnt.creator = await this.usersService.getUser(+restEnt.creator);
        (restEnt as any).mine = restEnt.creator.id === userId;

        return restEnt;
    }

    async insertRestaurant(restaurant: InsertRestaurantDto) {
        restaurant.image = await this.imageService.saveImage('restaurants', restaurant.image);
        restaurant.cuisine = restaurant.cuisine.map(c => c.trim());
        return await this.restRepo.save(restaurant);
    }

    async updateRestaurant(id: number, restaurant: InsertRestaurantDto, userId: number) {
        if (!restaurant.image.includes('restaurants')) {
            restaurant.image = await this.imageService.saveImage('restaurants', restaurant.image);
        } else {
            restaurant.image = restaurant.image.substr(restaurant.image.indexOf('img/'));
        }
        restaurant.cuisine = restaurant.cuisine.map(c => c.trim());
        delete restaurant.creator;
        await this.restRepo.update(id, restaurant);
        return await this.getRestaurant(id, userId);
    }

    deleteRestaurant(id: number) {
        return this.restRepo.delete(id);
    }
}
