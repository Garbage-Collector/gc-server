import { MailSendResponseDto } from "@gc/auth/mail/dtos/mail.send.response.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private generateVerifyCode(): number {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  async sendEmail(email: string): Promise<MailSendResponseDto> {
    const verifyCode = this.generateVerifyCode();

    await this.mailerService.sendMail({
      to: email,
      subject: "Garbage-Collector Email Verification",
      text: `Your verification code is: ${verifyCode}`,
    });

    return {
      email: email,
      "verify-code": verifyCode,
    };
  }
}
