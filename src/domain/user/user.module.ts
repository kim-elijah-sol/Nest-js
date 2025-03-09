import { Module } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,

    AuthService,
    AuthRepository,

    PrismaService,
  ],
  exports: [UserService],
})
export class UsersModule {}
