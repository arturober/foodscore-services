import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from 'users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    @Inject('JWT_KEY') jwt_key: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt_key,
    });
  }

  // tslint:disable-next-line:ban-types
  async validate(payload: JwtPayload, done: Function) {
    try {
      const user = await this.userService.getUser(payload.id);
      done(null, user);
    } catch {
      return done(new UnauthorizedException(), false);
    }
  }
}