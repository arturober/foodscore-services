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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'arturober.com',
      port: 3306,
      username: 'example',
      password: 'example',
      database: 'project1',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
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
