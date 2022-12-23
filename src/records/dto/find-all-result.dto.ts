import { RecordDocument } from '../schemas/record.schema';

type Result = {
  distance?: number;
  direction?: string;
  azimuth?: number;
};

export type FindAllResultDto = RecordDocument | Result;
