import {
  EntityRepository,
  QBFilterQuery,
  QueryOrder,
  QueryOrderMap,
  SelectQueryBuilder,
  raw,
} from '@mikro-orm/mariadb';
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
import { RestaurantFindOptions } from './interfaces/restaurant-find-optiones';

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
    where: QBFilterQuery<Restaurant> = null,
    orderBy: QueryOrderMap<Restaurant> = { distance: QueryOrder.ASC },
    page = 1,
  ): SelectQueryBuilder<Restaurant> {
    let builder = this.restaurantRepo
      .createQueryBuilder('r')
      .select([
        '*',
        raw(
          `haversine(r.lat, r.lng, ${authUser.lat}, ${authUser.lng}) AS distance`,
        ),
      ])
      .orderBy(orderBy);

    if (includeCommented) {
      builder = builder.addSelect(
        raw(
          `EXISTS (SELECT id FROM comment WHERE user = ${authUser.id} AND restaurant = r.id) AS commented`,
        ),
      );
    }

    if (where) {
      builder = builder.where(where);
    }

    if (includeCreator) {
      builder = builder.leftJoinAndSelect('r.creator', 'c');
    }

    return builder.limit(12).offset((page - 1) * 12);
  }

  findAll(authUser: User, options: RestaurantFindOptions) {
    return this.createRestaurantSelect(
      authUser,
      false,
      false,
      options.search ? { name: { $like: '%' + options.search + '%' } } : null,
      { distance: QueryOrder.ASC },
      options.page,
    ).getResultAndCount();
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

  findByUser(userId: number, authUser: User, options: RestaurantFindOptions) {
    const where = options.search
      ? { name: { $like: '%' + options.search + '%' } }
      : {};

    return this.createRestaurantSelect(
      authUser,
      false,
      false,
      {
        ...where,
        creator: { id: userId },
      },
      { distance: QueryOrder.ASC },
      options.page,
    )
      .where({ creator: userId  })
      .getResultAndCount();
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

    await this.restaurantRepo.insert(restaurant);
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
      if (prop !== 'image') {
        rest[prop] = updateDto[prop];
      }
    }
    rest.stars = stars;
    if (updateDto.image && !updateDto.image.startsWith('http')) {
      rest.image = await this.imageService.saveImage(
        'restaurants',
        updateDto.image,
      );
    }
    await this.restaurantRepo.getEntityManager().flush();
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
