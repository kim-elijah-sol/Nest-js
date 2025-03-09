import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/user/user.repository';
import { AuthRepository } from './auth.repository';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import { RefreshTokenPayload } from './types/RefreshTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createAccessToken(user: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(user, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: '1h',
    });
  }

  async createRefreshToken(user: RefreshTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(user, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      expiresIn: '2m',
    });
  }

  async refresh(userIdx: number, refreshToken: string): Promise<string> {
    const result = await this.authRepository.findRefreshToken(
      userIdx,
      refreshToken,
    );

    if (!result) {
      throw new UnauthorizedException('You need to log in first');
    }

    const user = await this.userRepository.findUserByIdx(userIdx);

    if (!user) throw new InternalServerErrorException();

    const accessToken = await this.createAccessToken(user);

    return accessToken;
  }

  async findRefreshToken(userIdx: number, refreshToken: string) {
    return await this.authRepository.findRefreshToken(userIdx, refreshToken);
  }

  async saveRefreshToken(userIdx: number, refreshToken: string) {
    await this.authRepository.createRefreshToken(userIdx, refreshToken);
  }

  async remeveRefreshToken(idx: number) {
    await this.authRepository.deleteRefreshTokenByIdx(idx);
  }
}
