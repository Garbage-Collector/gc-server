export class UserSocialSignupResponseDto {
  id: number;
  email: string;
  password: string;
  nickname: string;
  profile: string;
  isSocialAccount: boolean;
  socialProvider: Provider;
  externalId: string;
  socialRefreshToken: string;
}

export enum Provider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}
