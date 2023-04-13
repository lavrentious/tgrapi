import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { MailService } from './mail.service';
import { PasswordResetsModule } from './password-resets/password-resets.module';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './schemas/email-confirmation.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    AbilityModule,
    PasswordResetsModule,
  ],
  providers: [ConfigService, UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService, MailService],
})
export class UsersModule {}
