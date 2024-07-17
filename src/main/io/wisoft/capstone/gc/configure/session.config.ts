import { NestExpressApplication } from "@nestjs/platform-express";
import session from "express-session";
import passport from "passport";

export function sessionConfig(app: NestExpressApplication) {
  app.use(
    session({
      secret: "my-secret", // 세션을 암호화하기 위한 설정
      resave: false, // 모든 request마다 기존에 있던 session에 아무런 변경 사항이 없을 시에도 그 session을 다시 저장하는 옵션
      saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
      // 세션 쿠키에 대한 설정
      cookie: {
        maxAge: 60000, // 1 minute
        httpOnly: true,
      },
    }),
  );
  // Passport를 초기화하는 미들웨어, Passport의 인증/인가를 사용 가능
  app.use(passport.initialize());

  // Passport 세션을 사용하기 위한 미들웨어, Passport는 세션을 기반으로 사용자의 인증 상태를 유지 관리
  app.use(passport.session());
}
