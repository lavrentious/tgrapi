import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { PaginateOptions } from 'mongoose';

export class PaginateParams implements Partial<PaginateOptions> {
  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => value === true || value === 'true')
  @ValidateIf((_, value) => typeof value !== 'boolean')
  @IsOptional()
  pagination?: boolean = false;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
