import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EMailService {
  constructor(private readonly mailerService: MailerService) {}

  private shouldSkip() {
    if (process.env.MAIL_HOST === undefined) {
      return true;
    }
  }

  async sendAdminRegistration(email: string, context: { url: string }) {
    if (this.shouldSkip()) {
      return;
    }
    await this.mailerService.sendMail({
      to: email,
      subject: 'テンプレート管理者の登録確認メール',
      template: './admin-registration',
      context: context,
    });
  }
}
