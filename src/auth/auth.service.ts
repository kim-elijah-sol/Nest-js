import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domain/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import { RefreshTokenPayload } from './types/RefreshTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaClient: PrismaService,
  ) {}

  async logout(userIdx: number, refreshToken: string): Promise<void> {
    const refreshTokenInDB = await this.findRefreshToken(userIdx, refreshToken);

    if (!refreshTokenInDB) throw new InternalServerErrorException();

    await this.remeveRefreshToken(refreshTokenInDB.idx);
  }

  async refresh(userIdx: number, refreshToken: string): Promise<string> {
    const result = this.findRefreshToken(userIdx, refreshToken);

    if (!result) {
      throw new UnauthorizedException('You need to log in first');
    }

    const user = await this.userService.getUserByIdx(userIdx);

    if (!user) throw new InternalServerErrorException();

    const accessToken = await this.createAccessToken(user);

    return accessToken;
  }

  async createAccessToken(user: AccessTokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: '1h',
    });

    return accessToken;
  }

  async createRefreshToken(user: RefreshTokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      expiresIn: '2m',
    });

    return refreshToken;
  }

  async findRefreshToken(userIdx: number, refreshToken: string) {
    const result = await this.prismaClient.refreshToken.findFirst({
      where: {
        userIdx,
        refreshToken,
      },
    });

    return result;
  }

  async saveRefreshToken(userIdx: number, refreshToken: string): Promise<void> {
    await this.prismaClient.refreshToken.create({
      data: {
        userIdx,
        refreshToken,
      },
    });
  }

  async remeveRefreshToken(idx: number) {
    await this.prismaClient.refreshToken.delete({
      where: {
        idx,
      },
    });
  }
}
