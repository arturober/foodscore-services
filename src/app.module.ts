import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import mikroOrmConfig from './mikro-orm.config';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './app.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule.forRoot({
      googleId: configuration().google_id,
    }),
    RestaurantsModule,
    UsersModule,
    CommentsModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
