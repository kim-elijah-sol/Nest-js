import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinRequestDTO {
  @ApiProperty({ description: '사용할 id' })
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  readonly id: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  readonly password: string;

  @ApiProperty({ description: '회원 이름' })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  readonly name: string;
}
