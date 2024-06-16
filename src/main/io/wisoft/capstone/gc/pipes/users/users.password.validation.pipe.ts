import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UsersPasswordValidationPipe implements PipeTransform {
  async transform(
    usersSignupRequestDto: UsersSignupRequestDto,
  ): Promise<UsersSignupRequestDto> {
    const password = usersSignupRequestDto.password;
    const blankPattern = /\s/;
    const letterNumberSpecialPattern =
      /[A-Za-z\d~․!@#$%^&*()_\-+=\[\]|\\;:‘“<>,.?/]/;

    if (password.trim() === "") {
      throw new BadRequestException("패스워드는 빈 문자열일 수 없습니다.");
    }

    if (password.length < 8 || password.length > 20) {
      throw new BadRequestException(
        "패스워드는 8자 이상, 20자 이하여야 합니다.",
      );
    }

    if (blankPattern.test(password)) {
      throw new BadRequestException("패스워드에는 공백이 포함될 수 없습니다.");
    }

    if (letterNumberSpecialPattern.test(password)) {
      throw new BadRequestException(
        "패스워드는 영어, 숫자, 특수문자를 반드시 포함해야 합니다.",
      );
    }

    return usersSignupRequestDto;
  }
}
