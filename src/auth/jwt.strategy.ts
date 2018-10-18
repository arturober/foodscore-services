import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";
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

  async validate(payload: JwtPayload, done: Function) {
    const user = await this.userService.getUser(payload.id);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}