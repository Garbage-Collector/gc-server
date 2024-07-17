export class GoogleOAuthValidateProfileResponseDto {
  externalId: string;
  email: string;
  nickname: string;
  socialProvider: Provider;
  accessToken: string;
  refreshToken: string;
}

export enum Provider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}
