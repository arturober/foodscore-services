import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersModule } from 'users/users.module';
import { IsUserAlreadyExistConstraint } from './validators/user-exists.validator';
import { CommonsModule } from 'commons/commons.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, CommonsModule],
  controllers: [AuthController],
  providers: [
    IsUserAlreadyExistConstraint,
    AuthService,
    JwtStrategy,
    {
      provide: 'JWT_KEY',
      useValue: 'YTRnNk05TC4sLeG4iSorYXNkZg==',
    },
    {
      provide: 'JWT_EXPIRATION',
      useValue: 3600 * 24 * 365, // A year
    },
  ],
})
export class AuthModule {}
