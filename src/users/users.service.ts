import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';

@Injectable()
export class UsersService {
  constructor(private readonly prismaClient: PrismaService) {}

  async join(joinRequestDTO: JoinRequestDTO) {
    return await this.prismaClient.users.create({
      data: {
        id: joinRequestDTO.id,
        name: joinRequestDTO.name,
        password: SHA256(joinRequestDTO.password).toString(),
      },
    });
  }

  async login(loginRequestDTO: LoginRequestDTO) {
    return await this.prismaClient.users.findUnique({
      select: {
        idx: true
      },
      where: {
        id: loginRequestDTO.id,
        password: SHA256(loginRequestDTO.password).toString()
      }
    })
  }
}
