import {
  Body,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { JwtRefreshTokenGuard } from 'src/auth/guard/refreshToken.guard';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/join')
  @HttpCode(200)
  async join(@Body() joinRequestDTO: JoinRequestDTO) {
    try {
      await this.UserService.join(joinRequestDTO);

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

  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Delete('/test')
  async test() {
    return 'hi';
  }
}
