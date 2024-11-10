import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { JwtService } from "@gc/auth/jwt/jwt.service";

const rpName = "Garbage Collector";

const rpID = "capstone.wisoft.io";
// const rpID = "localhost";

const origin = `https://${rpID}`;
// const origin = `http://${rpID}:3001`;

const prisma = new PrismaClient();

@Injectable()
export class PasskeyService {
  constructor(private readonly jwtService: JwtService) {}

  private challenge: string;
  private userId: string; // Passkey 관련 UserId
  private authenticationChallenge: string;
  private id: number; // User 테이블의 id임

  // 옵션 설정 GET
  async options(email: string) {
    const user: any = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    this.id = user.id;

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
      await this.createPasskey(verification, this.id);
    }

    return verification;
  }

  // Passkey 생성
  async createPasskey(verification: any, userId: any) {
    const { registrationInfo } = verification;
    const { credential, credentialDeviceType, credentialBackedUp } =
      registrationInfo;

    try {
      // 새로운 Passkey 생성
      const newPasskey = await prisma.passkey.create({
        data: {
          id: credential.id, // Base64URLString
          publicKey: credential.publicKey, // Uint8Array -> Bytes로 저장
          userId: userId, // 외래 키로 사용자 ID
          webauthnUserID: this.userId, // Base64URLString
          counter: credential.counter, // BigInt
          deviceType: credentialDeviceType, // CredentialDeviceType
          backedUp: credentialBackedUp, // Boolean
          transports: credential.transports, // String[]
        },
      });

      return newPasskey;
    } catch (error) {
      console.error("Error creating passkey:", error);
      throw new Error("Passkey creation failed");
    }
  }

  // 입증 설정
  async authenticationOptions(email: string) {
    const user: any = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    this.id = user.id;

    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: this.id },
      select: {
        id: true,
        transports: true,
      },
    });

    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        rpID,
        // Require users to use a previously-registered authenticator
        allowCredentials: (userPasskeys ?? []).map((passkey: any) => ({
          id: passkey.id,
          transports: passkey.transports,
        })),
      });

    this.authenticationChallenge = options.challenge;

    return options;
  }

  // 입증 POST 과정
  async authenticationResponse(req: any) {
    const body = req;

    // 현재 user의 패스키를 찾는 로직
    const passkey: any = await prisma.passkey.findMany({
      where: { userId: this.id },
      select: {
        publicKey: true,
        id: true,
        counter: true,
        transports: true,
      },
    });

    const firstPasskey = passkey[0]; // passkey 배열의 첫 번째 객체 가져오기

    const id = firstPasskey.id;
    const publicKey = firstPasskey.publicKey;
    const counter = firstPasskey.counter;
    const transports = firstPasskey.transports;

    if (!passkey) {
      throw new Error(
        `Could not find passkey ${body.id} for user ${this.userId}`,
      );
    }

    let verification: any;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: this.authenticationChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: id,
          publicKey: publicKey,
          counter: Number(counter),
          transports: transports,
        },
      });
    } catch (error) {
      console.error(error);
    }

    return verification;
  }

  // 사용자 데이터 보내기
  async signin(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const records = await prisma.record.findMany({
      where: {
        userId: user.id,
      },
    });

    const tokens = this.jwtService.returnToken({ email: user.email });

    return {
      id: user.id,
      nickname: user.nickname,
      "profile-image": user.profile,
      recordIds: records.map((record) => record.id),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
