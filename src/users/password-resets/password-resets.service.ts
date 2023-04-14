import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail.service';
import { UsersService } from '../users.service';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';

@Injectable()
export class PasswordResetsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
  ) {}

  async findByKey(key: string) {
    return this.passwordResetModel.findOne({ key }).exec();
  }

  async create(usernameOrEmail: string) {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) throw new NotFoundException();
    const key = uuid();
    await this.mailService.sendPasswordResetEmail(user.email, key);
    return this.passwordResetModel.create({
      user: user._id,
      key,
    });
  }

  async check(key: string): Promise<PasswordResetDocument> {
    const doc = await this.findByKey(key);
    if (!doc) throw new NotFoundException('invalid key');
    return doc;
  }

  async reset(key: string, password: string) {
    const doc = await this.check(key);
    const user = await this.userService.findById(doc.user);
    await doc.deleteOne();
    return this.userService.setPassword(user, password, undefined, true);
  }
}
