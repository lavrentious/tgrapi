import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensService } from './tokens.service';

export const ACCESS_TOKEN_LIFESPAN = 900;
export const REFRESH_TOKEN_LIFESPAN = 2592000;

@Module({
  providers: [AuthService, TokensService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class AuthModule {}
