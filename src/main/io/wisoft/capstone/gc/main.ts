import * as fs from "node:fs";
import { AppModule } from "@gc/app.module";
import { basicAuthConfig } from "@gc/configure/basic-auth.config";
import { corsConfig } from "@gc/configure/cors.config";
import { staticAssetsConfig } from "@gc/configure/static-assets.config";
import { swaggerConfig } from "@gc/configure/swagger.config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap(): Promise<void> {
  const httpsOptions = {
    cert: fs.readFileSync("./resource/cert/fullchain.pem"),
    key: fs.readFileSync("./resource/cert/privkey.pem"),
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: httpsOptions,
  });

  basicAuthConfig(app);
  corsConfig(app);
  swaggerConfig(app);
  staticAssetsConfig(app);

  await app.listen(3000);
}
bootstrap();
