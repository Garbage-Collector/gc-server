import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { Module } from "@nestjs/common";
import { RecordsModule } from "./records/records.module";
import { UploadsService } from "./uploads/uploads.service";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [RecordsModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UploadsService, UsersService],
})
export class AppModule {}
