import { Module } from "@nestjs/common";
import { GoogleOauthController } from "./google-oauth.controller";
import { GoogleOAuthService } from "./google-oauth.service";

@Module({
  controllers: [GoogleOauthController],
  providers: [GoogleOAuthService],
})
export class GoogleOAuthModule {}
