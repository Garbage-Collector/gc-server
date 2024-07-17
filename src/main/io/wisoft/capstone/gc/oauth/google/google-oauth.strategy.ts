import {
  GoogleOAuthValidateProfileResponseDto,
  Provider,
} from "@gc/oauth/google/dtos/google-oauth.validate.profile.response.dto";
import { GoogleOAuthService } from "@gc/oauth/google/google-oauth.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly googleService: GoogleOAuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  // refreshToken 얻기 위한 설정
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "select_account",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails } = profile;

    if (!emails) {
      throw new Error("User Email not found");
    }

    console.info(profile);
    console.info(`accessToken : ${accessToken}`);
    console.info(`refreshToken : ${refreshToken}`);

    const googleLoginUserInfo: GoogleOAuthValidateProfileResponseDto = {
      externalId: id,
      email: emails[0].value,
      nickname: displayName,
      socialProvider: Provider.GOOGLE,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    try {
      const user =
        await this.googleService.validateUserAndCreate(googleLoginUserInfo);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
