import { UsersEmailValidationPipe } from "@gc/pipes/users/users.email.validation.pipe";
import { UsersNicknameValidationPipe } from "@gc/pipes/users/users.nickname.validation.pipe";
import { UsersPasswordValidationPipe } from "@gc/pipes/users/users.password.validation.pipe";
import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersDuplicateResponseDto } from "@gc/users/dtos/users.duplicate.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateRequestDto } from "@gc/users/dtos/users.update.request.dto";
import { UsersUpdateResponseDto } from "@gc/users/dtos/users.update.response.dto";
import { UsersService } from "@gc/users/users.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

@Controller("/api/users")
@ApiTags("User API")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/signup")
  @ApiOperation({
    summary: "회원가입",
    description: " email, password, nickname으로 유저 생성 진행",
  })
  @ApiCreatedResponse({
    type: UsersSignupResponseDto,
  })
  async signup(
    @Body(
      UsersEmailValidationPipe,
      UsersPasswordValidationPipe,
      UsersNicknameValidationPipe,
    )
    usersSignupDto: UsersSignupRequestDto,
  ): Promise<UsersSignupResponseDto> {
    return await this.usersService.signup(usersSignupDto);
  }

  @Post("/signin")
  @ApiOperation({
    summary: "로그인",
    description: "아이디와 비밀번호로 유저 로그인 진행, id 반환",
  })
  @ApiOkResponse({
    description: "사용자 id, nickname, recordIds[]를 반환",
    type: UsersSigninResponseDto,
  })
  async signin(
    @Body() usersSigninDto: UsersSigninRequestDto,
  ): Promise<UsersSigninResponseDto> {
    return await this.usersService.signin(usersSigninDto);
  }

  @Patch("")
  @ApiOperation({
    summary: "수정",
    description: "user의 닉네임을 수정",
  })
  @ApiOkResponse({
    description: "수정된 유저 정보를 반환",
    type: UsersUpdateResponseDto,
  })
  async updateUserNickname(
    @Body() usersUpdateDto: UsersUpdateRequestDto,
  ): Promise<UsersUpdateResponseDto> {
    return await this.usersService.updateNickname(usersUpdateDto);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "유저 삭제",
    description: "id로 유저 삭제",
  })
  @ApiOkResponse({
    description: "삭제된 유저 정보를 반환",
    type: UsersDeleteResponseDto,
  })
  async deleteUser(@Param("id") id: string): Promise<UsersDeleteResponseDto> {
    return await this.usersService.delete({ id: Number.parseInt(id) });
  }

  @Get("/email-check")
  @ApiOperation({
    summary: "이메일 중복 조회",
    description: "이메일 중복 조회",
  })
  async emailDuplicateCheck(
    @Query("email") email: string,
  ): Promise<UsersDuplicateResponseDto> {
    return this.usersService.emailDuplicateCheck(email);
  }

  @Get("/nickname-check")
  @ApiOperation({
    summary: "닉네임 중복 조회",
    description: "닉네임 중복 조회",
  })
  async nicknameDuplicateCheck(
    @Query("nickname") nickname: string,
  ): Promise<UsersDuplicateResponseDto> {
    return this.usersService.nicknameDuplicateCheck(nickname);
  }
}
