import { AppModule } from "@gc/app.module";
import { setupBasicAuth } from "@gc/configure/setupBasicAuth";
import { setupStaticAssets } from "@gc/configure/static.assets";
import { setupSwagger } from "@gc/configure/swagger";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupBasicAuth(app);
  setupSwagger(app);
  setupStaticAssets(app);

  await app.listen(3000);
}
bootstrap();
