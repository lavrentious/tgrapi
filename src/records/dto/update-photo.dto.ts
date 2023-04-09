import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UploadPhotoDto } from './upload-photo.dto';

export class UpdatePhotoDto extends PartialType(UploadPhotoDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
