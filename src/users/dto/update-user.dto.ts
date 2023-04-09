import { PartialType } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as rules from 'src/auth/utils/validations';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsEmail()
  @IsDefined()
  @ValidateIf((_, value) => value !== undefined)
  email?: string;

  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  @IsString()
  @IsDefined()
  @ValidateIf((_, value) => value !== undefined)
  password?: string;

  @IsString()
  @Length(rules.name.length.min, rules.name.length.max)
  @IsOptional()
  name?: string | null;

  @Matches(rules.username.regexp)
  @Length(rules.username.length.min, rules.username.length.max)
  @IsString()
  @IsOptional()
  username?: string | null;
}
