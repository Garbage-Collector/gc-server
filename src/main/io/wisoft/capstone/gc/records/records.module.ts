import { UploadsService } from "@gc/uploads/uploads.service";
import { Module } from "@nestjs/common";
import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";

@Module({
  providers: [RecordsService, UploadsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
