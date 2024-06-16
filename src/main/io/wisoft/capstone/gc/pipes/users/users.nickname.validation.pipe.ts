import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class UsersNicknameValidationPipe implements PipeTransform {
  async transform(
    usersSignupRequestDto: UsersSignupRequestDto,
  ): Promise<UsersSignupRequestDto> {
    const nickname = usersSignupRequestDto.nickname;
    const nicknamePattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (nickname.trim() === "" || nickname.length < 1 || nickname.length > 10) {
      throw new BadRequestException("닉네임은 1자 이상, 10자 이하여야 합니다.");
    }

    if (nicknamePattern.test(nickname)) {
      throw new BadRequestException(
        "닉네임에는 특수 문자가 포함될 수 없습니다.",
      );
    }

    const isUniqueNickname = await prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    if (isUniqueNickname) {
      throw new BadRequestException("이미 존재하는 닉네임입니다.");
    }

    return usersSignupRequestDto;
  }
}
