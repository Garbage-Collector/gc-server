import {
  GoogleOAuthValidateProfileResponseDto,
  Provider,
} from "@gc/oauth/google/dtos/google-oauth.validate.profile.response.dto";
import { UsersService } from "@gc/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleOAuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUserAndCreate(
    googleLoginUserInfo: GoogleOAuthValidateProfileResponseDto,
  ) {
    const { email, refreshToken, nickname, externalId } = googleLoginUserInfo;

    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      if (existingUser.socialProvider !== "GOOGLE") {
        return {
          msg: "Already exists",
        };
      }
      return await this.usersService.updateSocialRefreshToken(
        email,
        refreshToken,
      );
    }

    return this.usersService.socialSignup({
      externalId: externalId,
      displayName: nickname,
      socialProvider: Provider.GOOGLE,
      email: email,
      socialRefreshToken: refreshToken,
      isSocialAccount: true,
    });
  }
}
