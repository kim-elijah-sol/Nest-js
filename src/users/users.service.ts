import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaClient: PrismaService) {}

  async getUsers() {
    return await this.prismaClient.users.findMany();
  }
}
