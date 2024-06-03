import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { Module } from "@nestjs/common";
import { RecordsModule } from './records/records.module';

@Module({
  imports: [RecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
