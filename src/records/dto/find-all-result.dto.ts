import { ApiPropertyOptional } from '@nestjs/swagger';
import { Record } from '../schemas/record.schema';

export class FindAllResultDto extends Record {
  @ApiPropertyOptional()
  distance?: number;

  @ApiPropertyOptional()
  direction?: string;

  @ApiPropertyOptional()
  azimuth?: number;
}
