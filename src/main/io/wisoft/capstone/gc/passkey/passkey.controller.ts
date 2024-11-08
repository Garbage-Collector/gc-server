import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { PasskeyService } from "@gc/passkey/passkey.service";

@Controller("gc/api/passkey")
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}
  @Get("register")
  async getOptions(@Query('email') email: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
    return await this.passkeyService.options(email);
  }

  @Post("register")
  async verifyResponse(@Body() attResp: any) {
    return await this.passkeyService.verifyResponse(attResp);
  }
}
