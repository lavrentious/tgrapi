import { User } from 'src/users/schemas/user.schema';

export class PayloadDto {
  userId: string;
  constructor(user: User) {
    this.userId = user._id.toString();
  }
}
