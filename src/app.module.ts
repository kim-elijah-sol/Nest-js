import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './domain/user/user.module';

@Module({
  imports: [JwtModule.register({ global: true }), UsersModule, AuthModule],
})
export class AppModule {}
