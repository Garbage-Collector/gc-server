import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("GC")
    .setDescription("GC API description")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);
}
