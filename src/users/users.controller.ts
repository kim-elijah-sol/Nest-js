import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
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
}
