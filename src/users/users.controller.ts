import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDTO } from '../auth/dtos/LoginRequestDTO';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/join')
  @HttpCode(200)
  async join(@Body() joinRequestDTO: JoinRequestDTO) {
    try {
      await this.usersService.join(joinRequestDTO);

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

  @Get('login')
  @HttpCode(200)
  async login(@Query() loginRequestDTO: LoginRequestDTO) {
    try {
      const result = await this.usersService.login(loginRequestDTO);

      if (!result)
        throw new UnauthorizedException('Can not find matching account');

      return {
        statusCode: 200,
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
