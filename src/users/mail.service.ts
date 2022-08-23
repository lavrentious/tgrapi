import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Yandex',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationEmail(
    email: string,
    key: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const link = `${process.env.API_URL}/users/confirm-email/${key}`;
    return this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Account activation on ' + process.env.API_URL,
      html: `
        <div>
          <h1>Activate your account</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
