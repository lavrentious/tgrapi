import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, ObjectId, Query } from 'mongoose';
import { ACCESS_TOKEN_LIFESPAN, REFRESH_TOKEN_LIFESPAN } from './auth.module';
import { PayloadDto } from './dto/payload.dto';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  generateTokens(payload: PayloadDto): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(
      { ...payload },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: ACCESS_TOKEN_LIFESPAN,
      },
    );

    const refreshToken = jwt.sign(
      { ...payload },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_TOKEN_LIFESPAN,
      },
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(
    userId: string | ObjectId,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenDocument> {
    return this.tokenModel.create({
      user: userId,
      refreshToken,
      ipAddress,
      userAgent,
    });
  }

  async deleteRefreshToken(
    refreshToken: string,
  ): Promise<Query<any, TokenDocument>> {
    return this.tokenModel.deleteOne({ refreshToken });
  }

  async findRefreshToken(refreshToken: string): Promise<TokenDocument> {
    return this.tokenModel.findOne({ refreshToken });
  }

  validateAccessToken(accessToken: string): jwt.JwtPayload {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      if (typeof payload === 'string') throw new Error('invalid jwt');
      return payload;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string): jwt.JwtPayload | PayloadDto {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (typeof payload === 'string') throw new Error('invalid jwt');
      return payload;
    } catch (e) {
      return null;
    }
  }
}
