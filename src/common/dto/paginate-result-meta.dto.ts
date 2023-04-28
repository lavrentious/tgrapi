import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AggregatePaginateResult } from 'mongoose';
import { RemoveIndex } from 'src/auth/utils/remove-index';

export class PaginateResultMeta
  implements RemoveIndex<Omit<AggregatePaginateResult<void>, 'docs'>>
{
  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiPropertyOptional()
  page?: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  offset?: number;

  @ApiPropertyOptional()
  prevPage?: number;

  @ApiPropertyOptional()
  nextPage?: number;

  @ApiProperty()
  pagingCounter: number;
}
