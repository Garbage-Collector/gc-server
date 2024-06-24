import { UsersModule } from "@gc/users/users.module";
import { Module, forwardRef } from "@nestjs/common";
import { JwtModule as Jwt } from "@nestjs/jwt";
import { JwtController } from "./jwt.controller";
import { JwtService } from "./jwt.service";

@Module({
  imports: [Jwt.register({}), forwardRef(() => UsersModule)],
  controllers: [JwtController],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
