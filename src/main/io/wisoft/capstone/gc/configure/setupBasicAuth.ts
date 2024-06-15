import { NestExpressApplication } from "@nestjs/platform-express";
import expressBasicAuth from "express-basic-auth";

export function setupBasicAuth(app: NestExpressApplication): void {
  const SWAGGER_USER = process.env.SWAGGER_USER;
  const SWAGGER_PASSWORD = process.env.SWAGGER_PASSWORD;

  if (!SWAGGER_USER || !SWAGGER_PASSWORD) {
    throw new Error("SWAGGER_USER와 SWAGGER_PASSWORD 환경변수를 설정하세요.");
  }

  app.use(
    ["/docs", "/docs-json"],
    expressBasicAuth({
      challenge: true,
      users: {
        [SWAGGER_USER]: SWAGGER_PASSWORD,
      },
    }),
  );
}
