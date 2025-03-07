import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import { RefreshTokenPayload } from './types/RefreshTokenPayload';
import { TokenData } from './types/TokenData';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginRequestDTO): Promise<TokenData> {
    const user = await this.validateUser(loginDto);

    if (!user) throw new UnauthorizedException('Can not find matching account');

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    await this.saveRefreshToken(user.idx, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userIdx: number): Promise<void> {}

  async refresh(userIdx: number, refreshToken: string): Promise<TokenData> {
    const result = this.findRefreshToken(userIdx, refreshToken);

    if (!result) {
      throw new UnauthorizedException('You need to log in first');
    }

    const user = await this.userService.getUser(userIdx);

    if (!user) throw new InternalServerErrorException();

    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  // 유저 id, password 확인
  async validateUser(
    loginDto: LoginRequestDTO,
  ): Promise<AccessTokenPayload | null> {
    const user = await this.userService.login(loginDto);

    return user;
  }

  // access_token 발급
  async createAccessToken(user: AccessTokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: '1m',
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

  // DB의 refresh_token과 현재 refresh_token 비교
  async findRefreshToken(
    userIdx: number,
    refreshToken: string,
  ): Promise<boolean> {
    return true;
  }

  // DB user 데이터에 refresh_token 저장
  async saveRefreshToken(
    userIdx: number,
    refreshToken: string,
  ): Promise<void> {}
}
