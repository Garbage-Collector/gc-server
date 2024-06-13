import path from "node:path";
import { AppModule } from "@gc/app.module";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, "./uploads"), {
    prefix: "/media",
  });

  await app.listen(3000);
}
bootstrap();
