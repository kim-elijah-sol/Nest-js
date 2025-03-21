import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostRequestDTO {
  @ApiProperty({ description: '게시글 제목' })
  @IsString()
  readonly title: string;

  @ApiProperty({ description: '게시글 내용' })
  @IsString()
  readonly content: string;
}
