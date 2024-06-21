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
      html: `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Enter Verification Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    width: 300px;
                }
                .container h2 {
                    margin-top: 0;
                    font-size: 24px;
                    text-align: center;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .code-box {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;    
                    text-align: center;
                    font-size: 16px;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>GC 이메일 인증번호</h2>
                <div class="form-group">
                    <label for="verificationCode">인증번호</label>
                    <div class="code-box">${verifyCode}</div>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    return {
      email: email,
      "verify-code": verifyCode,
    };
  }
}
