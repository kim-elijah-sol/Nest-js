import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinRequestDTO } from './dtos/JoinRequestDTO';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';

@Injectable()
export class UserService {
  constructor(private readonly prismaClient: PrismaService) {}

  async join(joinRequestDTO: JoinRequestDTO) {
    return await this.prismaClient.user.create({
      data: {
        id: joinRequestDTO.id,
        name: joinRequestDTO.name,
        password: SHA256(joinRequestDTO.password).toString(),
      },
    });
  }

  async login(
    loginRequestDTO: LoginRequestDTO,
  ): Promise<AccessTokenPayload | null> {
    return await this.prismaClient.user.findUnique({
      select: {
        idx: true,
        id: true,
        name: true,
      },
      where: {
        id: loginRequestDTO.id,
        password: SHA256(loginRequestDTO.password).toString(),
      },
    });
  }

  async getUser(userIdx: number): Promise<AccessTokenPayload | null> {
    return await this.prismaClient.user.findUnique({
      select: {
        idx: true,
        id: true,
        name: true,
      },
      where: {
        idx: userIdx,
      },
    });
  }
}
