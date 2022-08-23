import { IsString } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
