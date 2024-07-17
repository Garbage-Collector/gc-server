import { GoogleOAuthGuard } from "@gc/oauth/google/google-oauth.guard";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";

@Controller("/api/auth/google")
export class GoogleOauthController {
  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {
    console.info("googleLogin method");
  }

  @Get("/redirect")
  @UseGuards(GoogleOAuthGuard)
  async googleLoginRedirect(@Req() req: string) {
    console.info("redirect method");
  }
}
