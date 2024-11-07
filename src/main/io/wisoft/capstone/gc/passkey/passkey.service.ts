import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import {
  AuthenticatorTransportFuture,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";

const rpName = "Garbage Collector";
const rpID = "localhost";
const port = 3001;
const origin = `http://${rpID}:${port}`;

const prisma = new PrismaClient();

@Injectable()
export class PasskeyService {
  private challenge: string;
  private userId: string;
  private authenticationChallenge: string;

  // 옵션 설정 GET
  async options(email: string) {
    const user: any = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        transports: true,
      },
    });

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpName,
        rpID,
        userName: user.nickname,
        attestationType: "none",
        excludeCredentials: (userPasskeys ?? []).map((passkey: any) => ({
          id: passkey.id,
          // Optional
          transports: passkey.transports,
        })),

        // See "Guiding use of authenticators via authenticatorSelection" below
        authenticatorSelection: {
          // Defaults
          residentKey: "preferred",
          userVerification: "preferred",
          // Optional
          authenticatorAttachment: "platform",
        },
      });

    // 사용자를 위해 다음 옵션을 기억하게 하는 코드임
    // setCurrentRegistrationOptions(user, options);
    this.challenge = options.challenge;
    this.userId = options.user.id;

    return options;
  }

  // 등록 응답 확인 POST 이게 참이면 데이터베이스에 등록함
  async verifyResponse(req: any) {
    const body = req;
    let verification: any;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: this.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
    } catch (error) {
      console.error(error);
    }
    if (verification.verified) {
      await this.createPasskey(verification);
    }

    return verification;
  }

  async createPasskey(verification: any) {
    const { registrationInfo } = verification;
    const { credential, credentialDeviceType, credentialBackedUp } =
      registrationInfo;

    try {
      // 새로운 Passkey 생성
      const newPasskey = await prisma.passkey.create({
        data: {
          id: credential.id, // Base64URLString
          publicKey: credential.publicKey, // Uint8Array -> Bytes로 저장
          userId: 4, // 외래 키로 사용자 ID
          webauthnUserID: this.userId, // Base64URLString
          counter: credential.counter, // BigInt
          deviceType: credentialDeviceType, // CredentialDeviceType
          backedUp: credentialBackedUp, // Boolean
          transports: credential.transports, // String[]
        },
      });

      // console.log('Passkey successfully created:', newPasskey);
      return newPasskey;
    } catch (error) {
      console.error("Error creating passkey:", error);
      throw new Error("Passkey creation failed");
    }
  }
}
