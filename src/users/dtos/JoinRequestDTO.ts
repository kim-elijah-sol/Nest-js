import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinRequestDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  readonly id: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  readonly password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(16)
  readonly name: string;
}
