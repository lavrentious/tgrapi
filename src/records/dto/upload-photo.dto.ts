import { IsOptional, IsString } from 'class-validator';

export class UploadPhotoDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
