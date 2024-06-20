import * as process from "node:process";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.ADMIN_HOST,
          port: process.env.ADMIN_PORT,
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PW,
          },
        },
        defaults: {
          from: `Garbage-Collector <${process.env.ADMIN_EMAIL}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
