import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../types/AccessTokenPayload';

export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.headers?.access_token;
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload) {
    req.user = payload;
    return payload;
  }
}
