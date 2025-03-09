import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async findRefreshToken(userIdx: number, refreshToken: string) {
    const result = await this.prismaClient.refreshToken.findFirst({
      where: {
        userIdx,
        refreshToken,
      },
    });

    return result;
  }

  async createRefreshToken(
    userIdx: number,
    refreshToken: string,
  ): Promise<void> {
    await this.prismaClient.refreshToken.create({
      data: {
        userIdx,
        refreshToken,
      },
    });
  }

  async deleteRefreshTokenByIdx(idx: number) {
    await this.prismaClient.refreshToken.delete({
      where: {
        idx,
      },
    });
  }
}
