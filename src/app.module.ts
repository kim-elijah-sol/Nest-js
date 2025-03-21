import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './domain/post/post.module';
import { UsersModule } from './domain/user/user.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({ global: true }),
    UsersModule,
    AuthModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
