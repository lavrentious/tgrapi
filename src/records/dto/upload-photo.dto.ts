import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadPhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
