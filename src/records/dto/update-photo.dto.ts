import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { UploadPhotoDto } from './upload-photo.dto';

export class UpdatePhotoDto extends PartialType(UploadPhotoDto) {
  @IsOptional()
  @IsString()
  comment?: string;
}
