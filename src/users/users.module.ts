import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), CommonsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
