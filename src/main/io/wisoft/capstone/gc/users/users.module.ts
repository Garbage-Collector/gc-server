import { JwtModule } from "@gc/auth/jwt/jwt.module";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [forwardRef(() => JwtModule)],
})
export class UsersModule {}
