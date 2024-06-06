import { UsersDeleteRequestDto } from "@gc/users/dtos/users.delete.request.dto";
import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateRequestDto } from "@gc/users/dtos/users.update.request.dto";
import { UsersUpdateResponseDto } from "@gc/users/dtos/users.update.response.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * 240604: 아래 new PrismaClient() 부분에 대한 처리 고민 필요해보임
 * */
const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async signup(
    usersSignupRequestDto: UsersSignupRequestDto,
  ): Promise<UsersSignupResponseDto> {
    try {
      await prisma.user.create({
        data: {
          email: usersSignupRequestDto.email,
          password: usersSignupRequestDto.password,
          nickname: usersSignupRequestDto.nickname,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }

    return {
      status: HttpStatus.OK,
    };
  }

  async signin(
    usersSigninRequestDto: UsersSigninRequestDto,
  ): Promise<UsersSigninResponseDto> {
    const user = await prisma.user.findFirst({
      where: {
        email: usersSigninRequestDto.email,
        password: usersSigninRequestDto.password,
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

    return {
      id: user.id,
      nickname: user.nickname,
      recordIds: records.map((record) => record.id),
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
