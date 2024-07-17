import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { JwtModule } from "@gc/auth/jwt/jwt.module";
import { GoogleOauthController } from "@gc/oauth/google/google-oauth.controller";
import { GoogleOAuthService } from "@gc/oauth/google/google-oauth.service";
import { GoogleOAuthStrategy } from "@gc/oauth/google/google-oauth.strategy";
import { SessionSerializer } from "@gc/utils/serializer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "./auth/mail/mail.module";
import { RecordsModule } from "./records/records.module";
import { UploadsService } from "./uploads/uploads.service";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";

@Module({
  imports: [
    RecordsModule,
    UsersModule,
    MailModule,
    JwtModule,
    ConfigModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AppController, UsersController, GoogleOauthController],
  providers: [
    AppService,
    UploadsService,
    UsersService,
    SessionSerializer,
    GoogleOAuthStrategy,
    GoogleOAuthService,
  ],
})
export class AppModule {}
