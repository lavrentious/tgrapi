import { ApiPropertyOptional } from '@nestjs/swagger';
import { Record } from '../schemas/record.schema';

export class FindAllRecord extends Record {
  @ApiPropertyOptional()
  distance?: number;

  @ApiPropertyOptional()
  azimuth?: number;
}
