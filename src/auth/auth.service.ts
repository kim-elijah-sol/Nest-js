import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/domain/user/dtos/User.dto';
import { UserRepository } from 'src/domain/user/user.repository';
import { AuthRepository } from './auth.repository';
import { TokenPayloadDTO } from './dtos/TokenPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createAccessToken(payload: TokenPayloadDTO): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: '10s',
    });
  }

  async createRefreshToken(payload: TokenPayloadDTO): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      expiresIn: '1h',
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

  async remeveRefreshToken(refreshToken: string) {
    await this.authRepository.deleteRefreshToken(refreshToken);
  }

  userToTokenPayload(user: UserDTO): TokenPayloadDTO {
    return {
      idx: user.idx,
      id: user.id,
    };
  }
}
