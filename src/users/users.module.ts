import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { MailService } from './mail.service';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './schemas/email-confirmation.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    AbilityModule,
  ],
  providers: [UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
