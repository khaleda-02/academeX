import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  username?: string;

  @Length(6, 12)
  password?: string;
}
