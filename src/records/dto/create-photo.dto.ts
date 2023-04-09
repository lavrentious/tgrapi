import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  publicId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;
}
