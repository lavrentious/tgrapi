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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  AddressWithDisplayName,
  MAX_PHOTOS,
  SpotType,
} from '../schemas/record.schema';

class PartialAddress implements Partial<AddressWithDisplayName> {
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

  @IsOptional()
  @IsString()
  displayName?: string;
}

export class UpdateRecordDto {
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
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

  @IsEnum(SpotType)
  @ValidateIf((_, value) => value !== undefined)
  type?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialAddress)
  address: PartialAddress;

  @IsOptional()
  @IsBoolean()
  autoAddress?: boolean;
}
