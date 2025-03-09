import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';
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

      const accessToken = await this.authService.createAccessToken(user);
      const refreshToken = await this.authService.createRefreshToken(user);

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
}
