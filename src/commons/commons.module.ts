import { Module } from '@nestjs/common';
import { ImageService } from './image/image.service';
import { PushService } from './push/push/push.service';

@Module({
  providers: [ImageService, PushService],
  exports: [ImageService, PushService],
})
export class CommonsModule {}
