import * as process from "node:process";
import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response, response } from "express";

@Controller("api/oauth/kakao")
export class KakaoController {
  @Get("/signin")
  async kakaoRedirect(@Res() res: Response) {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
    res.redirect(url);
  }

  @Get("callback")
  async getKakaoInfo(@Query() code: string) {
    console.info(code);
  }
}
