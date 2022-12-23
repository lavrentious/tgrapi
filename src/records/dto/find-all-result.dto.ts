import { RecordDocument } from '../schemas/record.schema';

export interface FindAllResultDto extends RecordDocument {
  distance?: number;
  direction?: string;
  azimuth?: number;
}
