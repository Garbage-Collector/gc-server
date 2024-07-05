import { JwtService } from "@gc/auth/jwt/jwt.service";
import { UsersDeleteRequestDto } from "@gc/users/dtos/users.delete.request.dto";
import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersDuplicateResponseDto } from "@gc/users/dtos/users.duplicate.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateNicknameRequestDto } from "@gc/users/dtos/users.update.nickname.request.dto";
import { UsersUpdateNicknameResponseDto } from "@gc/users/dtos/users.update.nickname.response.dto";
import { UsersUpdatePasswordRequestDto } from "@gc/users/dtos/users.update.password.request.dto";
import { UsersUpdatePasswordResponseDto } from "@gc/users/dtos/users.update.password.response.dto";
import { UsersVerifyPasswordRequestDto } from "@gc/users/dtos/users.verify.password.request.dto";
import { UsersVerifyPasswordResponseDto } from "@gc/users/dtos/users.verify.password.response.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

/**
 * 240604: 아래 new PrismaClient() 부분에 대한 처리 고민 필요해보임
 * */
const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}
  async signup(
    usersSignupRequestDto: UsersSignupRequestDto,
  ): Promise<UsersSignupResponseDto> {
    try {
      await prisma.user.create({
        data: {
          email: usersSignupRequestDto.email,
          password: await bcrypt.hash(usersSignupRequestDto.password, 10),
          nickname: usersSignupRequestDto.nickname,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }

    return {
      status: HttpStatus.CREATED,
    };
  }

  async signin(
    usersSigninRequestDto: UsersSigninRequestDto,
  ): Promise<UsersSigninResponseDto> {
    const user = await prisma.user.findFirst({
      where: {
        email: usersSigninRequestDto.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      usersSigninRequestDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new Error("Wrong password");
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
      recordIds: records.map((record) => record.id),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async updateNickname(
    usersUpdateNicknameRequestDto: UsersUpdateNicknameRequestDto,
    rawToken: string,
  ): Promise<UsersUpdateNicknameResponseDto> {
    const updatedUser = await prisma.user.update({
      where: {
        email: this.jwtService.extractEmailFromToken(rawToken),
      },
      data: {
        nickname: usersUpdateNicknameRequestDto.nickname,
      },
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      nickname: updatedUser.nickname,
    };
  }

  async updatePassword(
    usersUpdatePasswordRequestDto: UsersUpdatePasswordRequestDto,
    rawToken: string,
  ): Promise<UsersUpdatePasswordResponseDto> {
    const updatedUser = await prisma.user.update({
      where: {
        email: this.jwtService.extractEmailFromToken(rawToken),
      },
      data: {
        password: await bcrypt.hash(usersUpdatePasswordRequestDto.password, 10),
      },
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      password: updatedUser.password,
    };
  }

  async delete(
    usersDeleteRequestDto: UsersDeleteRequestDto,
  ): Promise<UsersDeleteResponseDto> {
    const deletedUser = await prisma.user.delete({
      where: {
        id: usersDeleteRequestDto.id,
      },
    });

    if (!deletedUser) {
      throw new Error("Delete Failed");
    }

    return deletedUser;
  }

  async emailDuplicateCheck(email: string): Promise<UsersDuplicateResponseDto> {
    const user = await prisma.user.findUnique({ where: { email } });

    return { available: !user };
  }

  async nicknameDuplicateCheck(
    nickname: string,
  ): Promise<UsersDuplicateResponseDto> {
    const user = await prisma.user.findUnique({ where: { nickname } });

    return { available: !user };
  }

  async verifyPassword(
    usersVerifyPasswordRequestDto: UsersVerifyPasswordRequestDto,
    rawToken: string,
  ): Promise<UsersVerifyPasswordResponseDto> {
    const email = this.jwtService.extractEmailFromToken(rawToken);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const isVerifiedPassword = await bcrypt.compare(
      usersVerifyPasswordRequestDto.password,
      user.password,
    );

    return {
      verified: isVerifiedPassword,
    };
  }
}
