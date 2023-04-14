import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model, Types } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { TokensService } from 'src/auth/tokens.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from './mail.service';
import {
  EmailConfirmation,
  EmailConfirmationDocument,
} from './schemas/email-confirmation.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly tokensService: TokensService,
    @InjectModel(EmailConfirmation.name)
    private readonly emailConfirmationModel: Model<EmailConfirmationDocument>,
  ) {}

  private async saveEmailConfirmation(
    userId: Types.ObjectId | string,
    email: string,
  ) {
    const key = uuidv4();
    const emailConfirmation =
      (await this.emailConfirmationModel.findOne({
        user: new Types.ObjectId(userId),
      })) ??
      new this.emailConfirmationModel({
        user: new Types.ObjectId(userId),
      });
    emailConfirmation.key = key;
    emailConfirmation.createdAt = new Date();
    return Promise.all([
      emailConfirmation.save(),
      this.mailService.sendActivationEmail(email, key),
    ]);
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      })
      .exec();
  }

  async register(dto: RegisterDto): Promise<UserDocument> {
    if (await this.checkIsEmailTaken(dto.email)) {
      throw new HttpException('email taken', HttpStatus.BAD_REQUEST);
    }
    if (dto.username && (await this.checkIsUsernameTaken(dto.username))) {
      throw new HttpException('username taken', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });
    await this.saveEmailConfirmation(user._id, dto.email);
    return user;
  }

  async findAll(fields?: string): Promise<UserDocument[]> {
    return this.userModel.find().select(fields).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(
    username: string,
    fields?: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ username }).select(fields).exec();
  }

  async findById(
    id: Types.ObjectId | string,
    fields?: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findById(id).select(fields).exec();
  }

  async updateOne(
    user: UserDocument,
    dto: UpdateUserDto,
  ): Promise<UserDocument> {
    const { email, username, name } = dto;
    if (email && user.email !== email) {
      const candidate = await this.checkIsEmailTaken(email);
      if (candidate) {
        throw new BadRequestException('email taken');
      }
      user.email = email;
      user.emailConfirmed = false;
      this.saveEmailConfirmation(user._id, email);
    }
    if (username === null) user.username = undefined;
    else if (username !== undefined && user.username !== username) {
      const candidate = await this.checkIsUsernameTaken(username);
      if (candidate) {
        throw new BadRequestException('username taken');
      }
      user.username = username;
    }
    if (name !== undefined) {
      user.name = name;
    }
    return user.save();
  }

  async confirmEmail(key: string): Promise<string> {
    const emailConfirmation = await this.emailConfirmationModel.findOne({
      key,
    });
    if (!emailConfirmation) {
      throw new NotFoundException('invalid activation key');
    }
    const user = await this.userModel.findById(emailConfirmation.user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.emailConfirmed) {
      throw new BadRequestException('email is already confirmed');
    }
    user.emailConfirmed = true;
    await user.save();
    await emailConfirmation.deleteOne();
    return 'email is confirmed successfully';
  }

  async resendEmailConfirmation(user: User) {
    console.log(`reconfirm`, user);
    if (user.emailConfirmed)
      throw new BadRequestException('email already confirmed');
    await this.saveEmailConfirmation(user._id, user.email);
  }

  async deleteById(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.deleteOne().select('-__v -password').exec();
  }

  async setPassword(
    user: UserDocument,
    password: string,
    refreshToken?: string,
    logout?: boolean,
  ) {
    user.password = await argon2.hash(password);
    if (logout) {
      await this.tokensService.deleteByUserId(user._id, refreshToken);
    }
    return user.save({ timestamps: false });
  }

  async updatePassword(
    user: UserDocument,
    dto: UpdatePasswordDto,
    refreshToken?: string,
  ) {
    const { oldPassword, newPassword, logout } = dto;
    const passwordOk = await argon2.verify(user.password, oldPassword);
    if (!passwordOk) throw new BadRequestException('incorrect password');
    return this.setPassword(user, newPassword, refreshToken, logout);
  }

  private async checkIsEmailTaken(
    email: string,
  ): Promise<{ _id: Types.ObjectId } | null> {
    return this.userModel.exists({ email }).exec();
  }

  private async checkIsUsernameTaken(
    username: string,
  ): Promise<{ _id: Types.ObjectId } | null> {
    return this.userModel.exists({ username }).exec();
  }
}
