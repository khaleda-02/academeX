import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;
}
