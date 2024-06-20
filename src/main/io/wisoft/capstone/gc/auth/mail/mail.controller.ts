import { MailService } from "@gc/auth/mail/mail.service";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller("/api/auth/mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ApiOperation({
    summary: "메일 발송",
    description: "특정 사용자에게 메일 발송",
  })
  async sendMail(@Query("email") email: string) {
    return this.mailService.sendEmail(email);
  }
}
