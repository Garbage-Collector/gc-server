import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class UsersEmailValidationPipe implements PipeTransform {
  async transform(
    usersSignupRequestDto: UsersSignupRequestDto,
  ): Promise<UsersSignupRequestDto> {
    const email: string = usersSignupRequestDto.email;
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email)) {
      throw new BadRequestException("유효한 이메일 주소여야 합니다.");
    }

    if (email.trim() === "") {
      throw new BadRequestException("이메일은 빈 문자열일 수 없습니다.");
    }

    if (email.length > 50) {
      throw new BadRequestException("이메일은 50자 이내여야 합니다.");
    }

    const isUniqueEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUniqueEmail) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    return usersSignupRequestDto;
  }
}
