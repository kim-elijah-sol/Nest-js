import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { TokenDTO } from 'src/auth/dtos/Token.dto';
import { TokenInfoDTO } from 'src/auth/dtos/TokenInfo.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Token, TokenInfo } from 'src/decorator';
import { JoinRequestDTO } from './dtos/JoinRequest.dto';
import { LoginRequestDTO } from './dtos/LoginRequest.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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

      const tokens = {
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
      await this.authService.remeveRefreshToken(token.refreshToken);

      return {
        statusCode: 200,
        success: true,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('me')
  @HttpCode(200)
  async me(@TokenInfo() tokenInfo: TokenInfoDTO) {
    const data = await this.userService.getUserByIdx(tokenInfo.idx);

    return {
      statusCode: 200,
      success: true,
      data,
    };
  }
}
