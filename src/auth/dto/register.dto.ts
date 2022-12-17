import * as rules from '../utils/validations';

import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  password: string;

  @IsOptional()
  @IsString()
  @Length(rules.name.length.min, rules.name.length.max)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(rules.username.regexp)
  @Length(rules.username.length.min, rules.username.length.max)
  username?: string;
}
