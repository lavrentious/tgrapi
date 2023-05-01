import { OmitType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

// TODO: optional values based on ability
export class PublicUser extends OmitType(User, ['password']) {}
