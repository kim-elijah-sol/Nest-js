import { CacheKey, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { AuthService } from 'src/auth/auth.service';
import { TokenDTO } from 'src/auth/dtos/Token.dto';
import { TokenInfoDTO } from 'src/auth/dtos/TokenInfo.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { JwtRefreshTokenGuard } from 'src/auth/guard/refreshToken.guard';
import { Token, TokenInfo } from 'src/decorator';
import { JoinRequestDTO } from './dtos/JoinRequest.dto';
import { LoginRequestDTO } from './dtos/LoginRequest.dto';
import { LoginResponseDTO } from './dtos/LoginResponse.dto';
import { MeResponseDTO } from './dtos/MeResponse.dto';
import { UserDTO } from './dtos/User.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('/join')
  @HttpCode(200)
  async join(@Body() joinRequestDTO: JoinRequestDTO) {
    try {
      await this.userService.join(joinRequestDTO);

      return {
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `${joinRequestDTO.id} is already registered`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiCreatedResponse({
    description: '로그인 성공 시 토큰을 발행합니다.',
    type: LoginResponseDTO,
  })
  async login(@Body() loginRequestDTO: LoginRequestDTO) {
    try {
      const user = await this.userService.login(loginRequestDTO);

      if (!user)
        throw new UnauthorizedException('Can not find matching account');

      const tokenPayload = this.authService.userToTokenPayload(user);

      const accessToken =
        await this.authService.createAccessToken(tokenPayload);
      const refreshToken =
        await this.authService.createRefreshToken(tokenPayload);

      const tokens: LoginResponseDTO = {
        accessToken,
        refreshToken,
      };

      await this.authService.saveRefreshToken(user.idx, tokens.refreshToken);

      return {
        statusCode: 200,
        success: true,
        data: tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @Delete('logout')
  @HttpCode(200)
  async logout(@Token() token: TokenDTO) {
    try {
      await this.authService.removeRefreshToken(token.refreshToken);

      return {
        statusCode: 200,
        success: true,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('me')
  @HttpCode(200)
  @ApiCreatedResponse({
    description: '회원 정보를 반환합니다.',
    type: MeResponseDTO,
  })
  async me(@TokenInfo() tokenInfo: TokenInfoDTO) {
    const user: UserDTO | null = await this.userService.getUserByIdx(
      tokenInfo.idx,
    );

    if (!user) throw new InternalServerErrorException();

    const data = this.userService.userToMe(user);

    return {
      statusCode: 200,
      success: true,
      data,
    };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  @HttpCode(200)
  async refresh(
    @Token() token: TokenDTO,
    @TokenInfo() tokenInfo: TokenInfoDTO,
  ) {
    const newAccessToken = await this.authService.refresh(
      tokenInfo.idx,
      token.refreshToken,
    );

    return {
      statusCode: 200,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    };
  }

  @CacheKey('cache-test')
  @CacheTTL(10000)
  @Get('cache-test')
  @HttpCode(200)
  async cacheTest() {
    const random = Math.random();

    return {
      statusCode: 200,
      success: true,
      data: {
        random,
      },
    };
  }

  @Get('remove-cache')
  async removeCache() {
    await this.cacheManager.del('cache-test');

    return {
      statusCode: 200,
      success: true,
    };
  }
}
