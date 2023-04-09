import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressWithDisplayName, SpotType } from '../schemas/record.schema';

export class CreateRecordDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accessibility?: string;

  @ApiProperty()
  @IsLatitude()
  lat: number;

  @ApiProperty()
  @IsLongitude()
  lon: number;

  @ApiProperty({ enum: SpotType })
  @IsEnum(SpotType)
  @IsString()
  type: string;

  @ApiPropertyOptional({
    default: true,
    description: 'true if no `address` is provided',
  })
  @IsOptional()
  @IsBoolean()
  autoAddress?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressWithDisplayName)
  address?: AddressWithDisplayName;
}
