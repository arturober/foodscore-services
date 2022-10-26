import { Module } from '@nestjs/common';
import { ImageService } from './image/image.service';

@Module({
  providers: [ImageService],
  exports: [ImageService],
})
export class CommonsModule {}
