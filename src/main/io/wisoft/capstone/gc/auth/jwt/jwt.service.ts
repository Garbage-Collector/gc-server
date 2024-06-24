import { JwtPayload } from "@gc/auth/jwt/jwt.payload";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService as Jwt } from "@nestjs/jwt";

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: Jwt) {}

  // 헤더의 토큰 검사
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(" ");
    const prefix = isBearer ? "Bearer" : "Basic";

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException("잘못된 토큰입니다.");
    }

    const token = splitToken[1];

    return token;
  }

  // 토큰 만료 검사
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException("토큰이 만료되었거나 잘못된 토큰입니다.");
    }
  }

  // payload와 유효시간 설정 - access token: 5분, refresh token: 1시간
  signToken(user: JwtPayload, isRefreshToken: boolean): string {
    const payload = {
      email: user.email,
      type: isRefreshToken ? "refresh" : "access",
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: isRefreshToken ? "1h" : "5m", // string format for clarity
    });
  }

  // 토큰 발급
  returnToken(user: JwtPayload): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  // 토큰 재발급
  rotateToken(token: string, isRefreshToken: boolean): string {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (decoded.type !== "refresh") {
      throw new UnauthorizedException(
        "토큰 재발급은 Refresh 토큰으로만 가능합니다.",
      );
    }

    return this.signToken(
      {
        email: decoded.email,
      },
      isRefreshToken,
    );
  }
}
