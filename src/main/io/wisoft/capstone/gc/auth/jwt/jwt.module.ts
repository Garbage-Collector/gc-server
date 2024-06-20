import { Module } from "@nestjs/common";
import { JwtModule as Jwt } from "@nestjs/jwt";
import { JwtController } from "./jwt.controller";
import { JwtService } from "./jwt.service";

@Module({
  imports: [Jwt.register({})],
  controllers: [JwtController],
  providers: [JwtService],
})
export class JwtModule {}
