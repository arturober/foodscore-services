import { EntityRepository, SelectQueryBuilder } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageService } from 'src/commons/image/image.service';
import { Restaurant } from 'src/entities/Restaurant';
import { User } from 'src/entities/User';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: EntityRepository<Restaurant>,
    private readonly imageService: ImageService,
  ) {}

  private createRestaurantSelect(
    authUser: User,
    includeCreator = true,
    includeCommented = true,
  ): SelectQueryBuilder<Restaurant> {
    let builder = this.restaurantRepo
      .createQueryBuilder('r')
      .select('*')
      .addSelect(
        `haversine(r.lat, r.lng, ${authUser.lat}, ${authUser.lng}) AS distance`,
      )
      .orderBy({ distance: 'ASC' });

    if (includeCommented) {
      builder = builder.addSelect(
        `EXISTS (SELECT id FROM comment WHERE user = ${authUser.id} AND restaurant = r.id) AS commented`,
      );
    }

    return includeCreator
      ? builder.leftJoinAndSelect('r.creator', 'c')
      : builder;
  }

  findAll(authUser: User): Promise<Restaurant[]> {
    return this.createRestaurantSelect(authUser, false, false).getResultList();
  }

  async findOne(id: number, authUser: User): Promise<Restaurant> {
    const rest = await this.createRestaurantSelect(authUser)
      .where({ id })
      .getSingleResult();
    if (!rest) {
      throw new NotFoundException({
        status: 404,
        error: 'Restaurant not found',
      });
    }
    return rest;
  }

  findByUser(userId: number, authUser: User) {
    return this.createRestaurantSelect(authUser)
      .where({ creator: { id: userId } })
      .getResultList();
  }

  async create(
    createDto: CreateRestaurantDto,
    authUser: User,
  ): Promise<Restaurant> {
    const imageUrl = await this.imageService.saveImage(
      'restaurants',
      createDto.image,
    );
    const restaurant = Restaurant.fromCreateDto(createDto);
    restaurant.image = imageUrl;
    restaurant.creator = authUser;
    restaurant.stars = 0;

    await this.restaurantRepo.persistAndFlush(restaurant);
    return restaurant;
  }

  async update(
    id: number,
    updateDto: UpdateRestaurantDto,
    authUser: User,
  ): Promise<Restaurant> {
    const rest = await this.findOne(id, authUser);

    if (rest.creator.id !== authUser.id) {
      throw new ForbiddenException(
        "This restaurant doesn't belong to you. You can't update it",
      );
    }

    const stars = rest.stars;
    for (const prop in updateDto) {
      rest[prop] = updateDto[prop];
    }
    rest.stars = stars;
    if (updateDto.image && !updateDto.image.startsWith('http')) {
      rest.image = await this.imageService.saveImage(
        'restaurants',
        updateDto.image,
      );
    }
    await this.restaurantRepo.persistAndFlush(rest);
    return rest;
  }

  async remove(id: number, authUser: User): Promise<void> {
    const rest = await this.findOne(id, authUser);
    if (rest.creator.id !== authUser.id) {
      throw new ForbiddenException(
        "This restaurant doesn't belong to you. You can't delete it",
      );
    }
    await this.restaurantRepo.nativeDelete(id);
  }
}
