import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDTO {
  @ApiProperty({ description: '엑세스 토큰' })
  @IsString()
  readonly accessToken: string;

  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  readonly refreshToken: string;
}
