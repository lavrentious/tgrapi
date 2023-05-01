import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { Photo } from '../schemas/photo.schema';
import { Record } from '../schemas/record.schema';

export class PopulatedRecordAuthor extends PickType(User, [
  '_id',
  'username',
]) {}

export class PopulatedRecord extends OmitType(Record, ['photos', 'author']) {
  @ApiProperty({ type: [Photo] })
  photos: Photo[];

  @ApiProperty({ type: PopulatedRecordAuthor })
  author: PopulatedRecordAuthor;
}
