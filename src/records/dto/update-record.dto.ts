import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  house?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;
}

export class UpdateRecordDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: [String], uniqueItems: true })
  @ArrayUnique()
  @ArrayMaxSize(MAX_PHOTOS)
  @IsMongoId({ each: true })
  @IsArray()
  @ValidateIf((_, value) => value !== undefined)
  photos?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  accessibility?: string | null;

  @ApiPropertyOptional()
  @IsLatitude()
  @ValidateIf((_, value) => value !== undefined)
  lat?: number;

  @ApiPropertyOptional()
  @IsLongitude()
  @ValidateIf((_, value) => value !== undefined)
  lon?: number;

  @ApiPropertyOptional()
  @IsEnum(SpotType)
  @ValidateIf((_, value) => value !== undefined)
  type?: number;

  @ApiPropertyOptional({ type: AddressWithDisplayName })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialAddress)
  address: PartialAddress;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  autoAddress?: boolean;
}
