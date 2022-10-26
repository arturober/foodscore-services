import { Module, DynamicModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { IsUserAlreadyExistConstraint } from './validators/user-exists.validator';
import { CommonsModule } from '../commons/commons.module';
import { GOOGLE_ID, AuthConfig, JWT_KEY } from './interfaces/providers';
import { User } from 'src/entities/User';
import { UsersModule } from 'src/users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({})
export class AuthModule {
  static forRoot(config: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        MikroOrmModule.forFeature([User]),
        UsersModule,
        CommonsModule,
        PassportModule,
        JwtModule.register({
          secret: 'YTRnNk05TC4sLeG4iSorYXNkZg==',
          signOptions: { expiresIn: '365d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        IsUserAlreadyExistConstraint,
        AuthService,
        JwtStrategy,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: JWT_KEY,
          useValue: 'YTRnNk05TC4sLeG4iSorYXNkZg==',
        },
        {
          provide: GOOGLE_ID,
          useValue: config.googleId,
        },
      ],
    };
  }
}
