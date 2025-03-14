import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDTO {
  @ApiProperty({ description: '회원 id' })
  readonly id: string;

  @ApiProperty({ description: '회원 이름' })
  readonly name: string;
}
