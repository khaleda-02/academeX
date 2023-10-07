import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
