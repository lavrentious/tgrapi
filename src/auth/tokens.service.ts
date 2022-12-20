import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, ObjectId, Query } from 'mongoose';
import { PayloadDto } from './dto/payload.dto';
import {
  ACCESS_TOKEN_LIFESPAN,
  REFRESH_TOKEN_LIFESPAN,
  Token,
  TokenDocument,
} from './schemas/token.schema';

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
    tokenId?: string | ObjectId,
  ): Promise<TokenDocument> {
    const tokenData = {
      user: userId,
      refreshToken,
      ipAddress,
      userAgent,
    };
    if (tokenId) {
      return this.tokenModel.findByIdAndUpdate(tokenId, {
        ...tokenData,
        issuedAt: Date.now(),
        expireAt: Date.now() + REFRESH_TOKEN_LIFESPAN * 1000,
      });
    }
    return this.tokenModel.create(tokenData);
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
