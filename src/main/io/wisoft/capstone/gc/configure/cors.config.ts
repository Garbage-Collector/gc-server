import * as process from "node:process";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from "@nestjs/platform-express";

export function corsConfig(app: NestExpressApplication): void {
  const corsOptions: CorsOptions = {
    origin: [
      `http://localhost:${process.env.GC_WEB_SPA}`,
      `http://localhost:${process.env.GC_WEB_PWA}`,
      `${process.env.GC_WEB_BUCKET}`,
    ],
    methods: "GET, POST, PUT, PATCH, DELETE",
  };

  app.enableCors(corsOptions);
}
