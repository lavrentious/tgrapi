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
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  accessibility?: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;

  @IsEnum(SpotType)
  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  autoAddress?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressWithDisplayName)
  address?: AddressWithDisplayName;
}
