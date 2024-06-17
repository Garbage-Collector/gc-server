import path from "node:path";
import { NestExpressApplication } from "@nestjs/platform-express";

export function setupStaticAssets(app: NestExpressApplication): void {
  app.useStaticAssets(path.join(__dirname, "../uploads"), {
    prefix: "/media",
  });
}
