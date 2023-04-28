import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateParams } from 'src/common/dto/paginate-params.dto';
import { CLOSEST_RADIUS } from 'src/records/records.service';

export class FindRecordsQueryParams extends PaginateParams {
  @ApiPropertyOptional({ minimum: -90, maximum: 90 })
  @IsOptional()
  @IsLatitude()
  @Type(() => Number)
  userLat?: number;

  @ApiPropertyOptional({ minimum: -180, maximum: 180 })
  @IsOptional()
  @IsLongitude()
  @Type(() => Number)
  userLon?: number;

  @ApiPropertyOptional({
    default: CLOSEST_RADIUS,
    description: 'radius in metres',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius?: number;

  @ApiPropertyOptional({
    description: 'query to search records (by name, description and address)',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
