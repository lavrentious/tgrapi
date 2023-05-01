import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultMeta } from 'src/common/dto/paginate-result-meta.dto';
import { PublicUser } from './public-user.dto';

export class FindAllUsersResultDto extends PaginateResultMeta {
  @ApiProperty({ type: [PublicUser] })
  docs: PublicUser[];
}
