import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { TokensService } from 'src/auth/tokens.service';
import { UsersService } from 'src/users/users.service';
import { PayloadDto } from './dto/payload.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenDocument } from './schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async register(
    dto: RegisterDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: PayloadDto }> {
    const user = await this.userService.register(dto);
    const payload = new PayloadDto(user);
    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveRefreshToken(
      payload.userId,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );
    return { ...tokens, user: { ...payload } };
  }

  async login(
    usernameOrEmail: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: PayloadDto }> {
    const user =
      (await this.userService.findByEmail(usernameOrEmail)) ??
      (await this.userService.findByUsername(usernameOrEmail));
    if (!user) {
      throw new HttpException('incorrect email/username', HttpStatus.NOT_FOUND);
    }
    const passwordsEqual = await argon.verify(user?.password, password);
    if (!passwordsEqual) {
      throw new HttpException('incorrect password', HttpStatus.BAD_REQUEST);
    }
    const payload = new PayloadDto(user);
    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveRefreshToken(
      payload.userId,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );
    return { ...tokens, user: { ...payload } };
  }

  async logout(refreshToken: string): Promise<TokenDocument> {
    return this.tokenService.deleteRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string, ipAddress: string, userAgent: string) {
    const decoded = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findRefreshToken(refreshToken);
    if (!decoded || !tokenFromDb) {
      throw new UnauthorizedException('invalid token');
    }
    const user = await this.userService.findById(decoded.userId);
    const payload = new PayloadDto(user);
    const tokens = this.tokenService.generateTokens(payload);

    await this.tokenService.saveRefreshToken(
      payload.userId,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );
    return { ...tokens, user: { ...payload } };
  }
}
