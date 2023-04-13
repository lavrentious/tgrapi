import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import * as rules from 'src/auth/utils/validations';

export class ResetPasswordDto {
  @ApiProperty({
    pattern: rules.password.regexp.source,
    minLength: rules.password.length.min,
    maxLength: rules.password.length.max,
  })
  @IsString()
  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  @IsString()
  password: string;
}
