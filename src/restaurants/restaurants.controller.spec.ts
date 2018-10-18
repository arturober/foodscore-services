import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';

describe('Restaurants Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RestaurantsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RestaurantsController = module.get<RestaurantsController>(RestaurantsController);
    expect(controller).toBeDefined();
  });
});
