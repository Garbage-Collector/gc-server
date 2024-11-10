import {
  forwardRef,
  Module,
} from "@nestjs/common";
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import {JwtModule} from "@gc/auth/jwt/jwt.module";

@Module({
  imports: [forwardRef(() => JwtModule)],
  providers: [PasskeyService],
  controllers: [PasskeyController]
})
export class PasskeyModule {}
