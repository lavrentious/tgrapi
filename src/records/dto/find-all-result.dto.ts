import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultMeta } from 'src/common/dto/paginate-result-meta.dto';
import { FindAllRecord } from './find-all-record.dto';

export class FindAllResultDto extends PaginateResultMeta {
  @ApiProperty({ type: [FindAllRecord] })
  docs: FindAllRecord[];
}
