import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenDTO } from 'src/auth/dtos/Token.dto';

export const Token = createParamDecorator(
  (data, ctx: ExecutionContext): TokenDTO => {
    const request = ctx.switchToHttp().getRequest();

    const accessToken = request?.headers?.access_token;
    const refreshToken = request?.headers?.refresh_token;

    const token = {
      accessToken,
      refreshToken,
    };

    return token as TokenDTO;
  },
);
