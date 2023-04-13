import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePasswordResetDto {
  @ApiProperty()
  @IsString()
  usernameOrEmail: string;
}
