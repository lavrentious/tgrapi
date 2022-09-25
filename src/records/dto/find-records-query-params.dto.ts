import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindRecordsQueryParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userLon?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
