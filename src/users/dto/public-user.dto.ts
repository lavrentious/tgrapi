import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

// TODO: optional values based on ability
export class PublicUser extends IntersectionType(
  OmitType(User, ['password']),
  PickType(PartialType(User), [
    'email',
    'emailConfirmed',
    'createdAt',
    'updatedAt',
    'name',
  ]),
) {}
