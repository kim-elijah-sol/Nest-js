import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayloadDTO } from '../dtos/TokenPayload.dto';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('accessToken') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      const accessToken = request?.headers?.access_token as string;

      if (!accessToken) {
        throw new UnauthorizedException('access token is undefined');
      }

      const payload = this.validate(accessToken);

      request.tokenInfo = payload;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException();
    }
  }

  validate(token: string): TokenPayloadDTO {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET!;

    try {
      const verify: TokenPayloadDTO = this.jwtService.verify(token, {
        secret,
      });

      return verify;
    } catch (e) {
      switch (e.message) {
        case 'jwt expired':
          throw new UnauthorizedException('token is expired');
        case 'invalid signature':
        case 'jwt malformed':
          throw new UnauthorizedException('token is invalid');
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
