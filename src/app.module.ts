import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RestaurantsModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    CommonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
