import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({ description: '로그인 할 id' })
  @IsString()
  readonly id: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  readonly password: string;
}
