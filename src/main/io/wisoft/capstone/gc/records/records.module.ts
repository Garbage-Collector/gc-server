import { JwtModule } from "@gc/auth/jwt/jwt.module";
import { UploadsService } from "@gc/uploads/uploads.service";
import { Module, forwardRef } from "@nestjs/common";
import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";

@Module({
  imports: [forwardRef(() => JwtModule)],
  providers: [RecordsService, UploadsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
