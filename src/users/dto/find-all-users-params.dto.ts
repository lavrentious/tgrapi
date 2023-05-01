import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateParams } from 'src/common/dto/paginate-params.dto';

export class FindUsersQueryParams extends PaginateParams {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;
}
