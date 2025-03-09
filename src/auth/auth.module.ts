import { Module } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/user.repository';
import { UserService } from 'src/domain/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  providers: [
    AuthService,
    AuthRepository,

    UserService,
    UserRepository,

    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
