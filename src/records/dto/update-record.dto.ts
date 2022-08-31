import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address, MAX_PHOTOS, SpotType } from '../schemas/record.schema';

class PartialAddress implements Partial<Address> {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  house?: string;
}

export class UpdateRecordDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ArrayUnique()
  @ArrayMaxSize(MAX_PHOTOS)
  @IsMongoId({ each: true })
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsString()
  accessibility?: string;

  @IsOptional()
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @IsLongitude()
  lon?: number;

  @IsOptional()
  @IsEnum(SpotType)
  type?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialAddress)
  address: PartialAddress;

  @IsOptional()
  @IsBoolean()
  autoAddress?: boolean;
}
