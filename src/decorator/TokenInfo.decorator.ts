import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadDTO } from 'src/auth/dtos/TokenPayload.dto';

export const TokenInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayloadDTO => {
    const request = ctx.switchToHttp().getRequest();

    return request.tokenInfo as TokenPayloadDTO;
  },
);
