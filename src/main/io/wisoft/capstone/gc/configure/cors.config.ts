import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from "@nestjs/platform-express";

export function corsConfig(app: NestExpressApplication): void {
  const corsOptions: CorsOptions = {
    origin: ["http://localhost:9000", "http://localhost:9200"],
    methods: "GET, POST, PUT, PATCH, DELETE",
  };

  app.enableCors(corsOptions);
}
