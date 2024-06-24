import { JwtService } from "@gc/auth/jwt/jwt.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly authService: JwtService) {}

  // canActivate는 NestJS의 인증 및 권한 부여를 처리하는 데 사용되는 가드
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 요청의 HTTP 객체를 들고온다. 이를 통해 요청의 헤더, 바디, 파라미터 등을 접근할 수 있음
    const request = context.switchToHttp().getRequest();

    // 2. Authorization 헤더에서 JWT 토큰을 추출
    const rawToken = request.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = await this.authService.verifyToken(token);

    request.token = token;
    request.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== "access") {
      throw new UnauthorizedException("Access Token이 아닙니다.");
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== "refresh") {
      throw new UnauthorizedException("Refresh Token이 아닙니다.");
    }

    return true;
  }
}
