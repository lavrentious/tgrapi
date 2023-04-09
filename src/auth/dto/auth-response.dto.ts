import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';

class AuthResponseUser extends PickType(User, ['username', 'name', 'role']) {
  @ApiProperty()
  id: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: AuthResponseUser;
}
