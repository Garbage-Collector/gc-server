export class UserSocialSignupRequestDto {
  externalId: string;
  displayName: string;
  email: string;
  socialProvider: Provider;
  socialRefreshToken: string;
  isSocialAccount: boolean;
}

export enum Provider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}
