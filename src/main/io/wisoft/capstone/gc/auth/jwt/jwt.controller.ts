import { RefreshTokenGuard } from "@gc/auth/guard/bearer-token-guard.service";
import { JwtService } from "@gc/auth/jwt/jwt.service";
import { Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller("/api/auth")
export class JwtController {
  constructor(private readonly authService: JwtService) {}

  @Post("token/access")
  @ApiOperation({
    summary: "access 토큰 발급",
    description: "refresh 토큰으로 만료된 access 토큰 발급",
  })
  @UseGuards(RefreshTokenGuard)
  async postAccessToken(
    @Headers("authorization") rawToken: string,
  ): Promise<{ accessToken: string }> {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }
}
