import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { RefreshTokenPayload } from '../types/RefreshTokenPayload';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.headers?.refresh_token;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req?.headers?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token is undefined');
    }

    const result = this.authService.findRefreshToken(
      payload.idx,
      refreshToken.toString(),
    );

    if (!result) {
      throw new UnauthorizedException('refresh token is wrong');
    }

    req.user = payload;

    return payload;
  }
}
