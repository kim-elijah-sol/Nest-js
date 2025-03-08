import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { JwtRefreshTokenGuard } from 'src/auth/guard/refreshToken.guard';
import { JwtAccessTokenStrategy } from 'src/auth/strategy/accessToken.strategy';
import { JwtRefreshTokenStrategy } from 'src/auth/strategy/refreshToken.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
  ],
  exports: [UserService],
})
export class UsersModule {}
