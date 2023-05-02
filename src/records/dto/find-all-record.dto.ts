import { ApiPropertyOptional } from '@nestjs/swagger';
import { Record } from '../schemas/record.schema';

export class FindAllRecord extends Record {
  @ApiPropertyOptional({
    description: 'distance in metres',
  })
  distance?: number;

  @ApiPropertyOptional({
    minimum: -180,
    maximum: 180,
    description: 'geographical azimuth in degrees',
  })
  azimuth?: number;
}
