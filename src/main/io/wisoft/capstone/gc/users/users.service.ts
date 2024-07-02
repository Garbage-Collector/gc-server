import { JwtService } from "@gc/auth/jwt/jwt.service";
import { UsersDeleteRequestDto } from "@gc/users/dtos/users.delete.request.dto";
import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersDuplicateResponseDto } from "@gc/users/dtos/users.duplicate.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateRequestDto } from "@gc/users/dtos/users.update.request.dto";
import { UsersUpdateResponseDto } from "@gc/users/dtos/users.update.response.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

/**
 * 240604: 아래 new PrismaClient() 부분에 대한 처리 고민 필요해보임
 * */
const prisma = new PrismaClient();

/**
 * email 중복 여부 체크 필요
 * */
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
    usersUpdateRequestDto: UsersUpdateRequestDto,
  ): Promise<UsersUpdateResponseDto> {
    const updatedUser = await prisma.user.update({
      where: {
        id: await this.getIdByEmail(usersUpdateRequestDto.email),
      },
      data: {
        nickname: usersUpdateRequestDto.nickname,
      },
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
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

  async getIdByEmail(email: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.id;
  }
}
