import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users.module';
import { PasswordResetsController } from './password-resets.controller';
import { PasswordResetsService } from './password-resets.service';
import {
  PasswordReset,
  PasswordResetSchema,
} from './schemas/password-reset.schema';

@Module({
  controllers: [PasswordResetsController],
  providers: [PasswordResetsService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),
  ],
  exports: [PasswordResetsModule],
})
export class PasswordResetsModule {}
