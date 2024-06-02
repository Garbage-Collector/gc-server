import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
