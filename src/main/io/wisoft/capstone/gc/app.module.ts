import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { JwtModule } from "@gc/auth/jwt/jwt.module";
import { Module } from "@nestjs/common";
import { MailModule } from "./auth/mail/mail.module";
import { RecordsModule } from "./records/records.module";
import { UploadsService } from "./uploads/uploads.service";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";

@Module({
  imports: [RecordsModule, UsersModule, MailModule, JwtModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UploadsService, UsersService],
})
export class AppModule {}
