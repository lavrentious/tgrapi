import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePhotoDto {
  @IsUrl()
  url: string;

  @IsString()
  publicId: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
