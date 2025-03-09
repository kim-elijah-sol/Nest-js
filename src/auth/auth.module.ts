import { Module } from '@nestjs/common';
import { UserService } from 'src/domain/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Module({
  providers: [UserService, AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
