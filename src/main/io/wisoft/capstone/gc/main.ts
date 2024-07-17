import { AppModule } from "@gc/app.module";
import { basicAuthConfig } from "@gc/configure/basic-auth.config";
import { corsConfig } from "@gc/configure/cors.config";
import { sessionConfig } from "@gc/configure/session.config";
import { staticAssetsConfig } from "@gc/configure/static-assets.config";
import { swaggerConfig } from "@gc/configure/swagger.config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  basicAuthConfig(app);
  corsConfig(app);
  swaggerConfig(app);
  staticAssetsConfig(app);
  sessionConfig(app);

  await app.listen(3000);
}
bootstrap();
