import { RecordDocument } from '../schemas/record.schema';

type Result = {
  distance: number | undefined;
  direction: string | undefined;
  azimuth: number | undefined;
};

export type FindAllResultDto = RecordDocument & Result;
