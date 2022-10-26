import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/User';

export const AuthUser = createParamDecorator<unknown, ExecutionContext, User>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
