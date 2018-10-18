import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';

describe('Comments Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommentsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CommentsController = module.get<CommentsController>(CommentsController);
    expect(controller).toBeDefined();
  });
});
