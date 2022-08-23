import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { MAX_PHOTOS } from '../schemas/record.schema';
import { CreateRecordDto } from './create-record.dto';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
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
}
