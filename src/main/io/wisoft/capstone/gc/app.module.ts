import { AppController } from "@gc/app.controller";
import { AppService } from "@gc/app.service";
import { JwtModule } from "@gc/auth/jwt/jwt.module";
import { Module } from "@nestjs/common";
import { MailModule } from "./auth/mail/mail.module";
import { RecordsModule } from "./records/records.module";
import { UploadsService } from "./uploads/uploads.service";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "./.env",
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, ".."),
    }),
    RecordsModule,
    UsersModule,
    MailModule,
    JwtModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UploadsService, UsersService],
})
export class AppModule {}
