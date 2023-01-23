import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import mikroOrmConfig from './mikro-orm.config';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule.forRoot({ // Put your own Google ID here (same as the client's Google ID)
      googleId: '746820501392-nc4pet9ffnm8gq8hg005re9e6ho65nua.apps.googleusercontent.com',
    }),
    RestaurantsModule,
    UsersModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
