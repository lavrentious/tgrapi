import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as rules from '../utils/validations';

import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    pattern: rules.password.regexp.source,
    minLength: rules.password.length.min,
    maxLength: rules.password.length.max,
  })
  @IsString()
  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  password: string;

  @ApiPropertyOptional({
    minLength: rules.name.length.min,
    maxLength: rules.name.length.max,
  })
  @IsOptional()
  @IsString()
  @Length(rules.name.length.min, rules.name.length.max)
  name?: string;

  @ApiPropertyOptional({
    pattern: rules.username.regexp.source,
    minLength: rules.username.length.min,
    maxLength: rules.username.length.max,
  })
  @IsOptional()
  @IsString()
  @Matches(rules.username.regexp)
  @Length(rules.username.length.min, rules.username.length.max)
  username?: string;
}
