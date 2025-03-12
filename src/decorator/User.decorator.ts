import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from 'src/domain/user/dtos/User.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDTO => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as UserDTO;
  },
);
