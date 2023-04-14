import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import * as rules from 'src/auth/utils/validations';

export class UpdatePasswordDto {
  @ApiProperty()
  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @Matches(rules.password.regexp)
  @Length(rules.password.length.min, rules.password.length.max)
  @IsString()
  newPassword: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  logout?: boolean;
}
