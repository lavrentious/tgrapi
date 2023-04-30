import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EnvironmentVariables } from 'src/env.validation';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_SERVER'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendActivationEmail(
    email: string,
    key: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const link = `${this.configService.get(
      'API_URL',
    )}/users/confirm-email/${key}`;
    return this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Account activation on ' + this.configService.get('API_URL'),
      html: `
        <div>
          <h1>Activate your account</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    key: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const link = `${this.configService.get(
      'CLIENT_URL',
    )}/reset-password/${key}`;
    return this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Сброс пароля TifloGuide',
      html: `
        <div>
          <h1>Перейдите по ссылке для сброса пароля</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
