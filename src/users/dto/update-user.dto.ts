import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  username?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;
}
