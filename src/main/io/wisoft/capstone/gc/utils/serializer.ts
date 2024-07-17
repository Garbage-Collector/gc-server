import { UsersService } from "@gc/users/users.service";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async serializeUser(user: any, done: (err: any, user?: any) => void) {
    console.info("Serialize");
    console.info(user);
    done(null, user);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async deserializeUser(payload: any, done: (err: any, user?: any) => void) {
    const user = await this.usersService.findUserByExternalId(
      payload.externalId,
    );
    console.info("Deserialize");
    console.info(user);
    return user ? done(null, user) : done(null, null);
  }
}
