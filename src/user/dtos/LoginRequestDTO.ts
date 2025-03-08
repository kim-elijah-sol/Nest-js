import { IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  readonly id: string;

  @IsString()
  readonly password: string;
}
