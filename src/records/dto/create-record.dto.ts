import { Type } from 'class-transformer';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address, SpotType } from '../schemas/record.schema';

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
  type: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  address?: Address;
}
