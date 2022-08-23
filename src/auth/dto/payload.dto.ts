import { UserDocument } from 'src/users/schemas/user.schema';

export class PayloadDto {
  userId: string;
  constructor(user: UserDocument) {
    this.userId = user._id;
  }
}
