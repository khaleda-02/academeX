import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Status } from '../enums';

export class FilterDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  page: string;

  @IsOptional()
  pageSize: string;
}
