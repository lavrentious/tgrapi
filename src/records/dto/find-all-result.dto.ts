import { Record } from '../schemas/record.schema';

export interface FindAllResultDto extends Record {
  distance?: number;
  direction?: string;
  azimuth?: number;
}
