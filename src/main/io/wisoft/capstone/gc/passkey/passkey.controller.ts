import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from "@nestjs/common";
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { PasskeyService } from "@gc/passkey/passkey.service";

@Controller("/api/passkey")
// @Controller("api/passkey")
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}
  @Get("register")
  async getOptions(
    @Query("email") email: string,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    return await this.passkeyService.options(email);
  }

  @Post("register")
  async verifyResponse(@Body() attResp: any): Promise<any> {
    return await this.passkeyService.verifyResponse(attResp);
  }

  @Get("/authentication")
  async authenticationOptions(
    @Query("email") email: string,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return await this.passkeyService.authenticationOptions(email);
  }

  @Post("/authentication")
  async authenticationResponse(@Body() attResp: any): Promise<any> {
    return await this.passkeyService.authenticationResponse(attResp);
  }

  @Get("/signin")
  async passkeySignin(@Query("email") email: string) {
    return this.passkeyService.signin(email).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }
}
