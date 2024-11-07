import { Module } from '@nestjs/common';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';

@Module({
  providers: [PasskeyService],
  controllers: [PasskeyController]
})
export class PasskeyModule {}
