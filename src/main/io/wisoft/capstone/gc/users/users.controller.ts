import { AccessTokenGuard } from "@gc/auth/guard/bearer-token-guard.service";
import { UsersEmailValidationPipe } from "@gc/pipes/users/users.email.validation.pipe";
import { UsersNicknameValidationPipe } from "@gc/pipes/users/users.nickname.validation.pipe";
import { UsersPasswordValidationPipe } from "@gc/pipes/users/users.password.validation.pipe";
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
import { UsersUpdateProfileResponseDto } from "@gc/users/dtos/users.update.profile.response.dto";
import { UsersVerifyPasswordRequestDto } from "@gc/users/dtos/users.verify.password.request.dto";
import { UsersVerifyPasswordResponseDto } from "@gc/users/dtos/users.verify.password.response.dto";
import { UsersService } from "@gc/users/users.service";
import { multerOptions } from "@gc/utils/multer.options";
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UsersUpdatePasswordInMainPageRequestDto } from "@gc/users/dtos/users.update.password.in.main.page.request.dto";
import { UsersUpdatePasswordInMainPageResponseDto } from "@gc/users/dtos/users.update.password.in.main.page.response.dto";

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
    return this.usersService.signin(usersSigninDto).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }

  @Patch("nickname")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: "수정",
    description: "user의 닉네임을 수정",
  })
  @ApiOkResponse({
    description: "수정된 유저 닉네임을 반환",
    type: UsersUpdateNicknameResponseDto,
  })
  async updateUserNickname(
    @Body() usersUpdateDto: UsersUpdateNicknameRequestDto,
    @Headers("authorization") rawToken: string,
  ): Promise<UsersUpdateNicknameResponseDto> {
    return await this.usersService.updateNickname(usersUpdateDto, rawToken);
  }

  @Patch("password")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: "수정",
    description: "user의 비밀번호를 수정",
  })
  @ApiOkResponse({
    description: "수정된 비밀번호를 반환",
    type: UsersUpdateNicknameResponseDto,
  })
  async updateUserPassword(
    @Body() usersUpdateDto: UsersUpdatePasswordRequestDto,
    @Headers("authorization") rawToken: string,
  ): Promise<UsersUpdatePasswordResponseDto> {
    return await this.usersService.updatePassword(usersUpdateDto, rawToken);
  }

  @Patch("forgot-password")
  async updateUserPasswordInMain(
    @Body() usersUpdateDto: UsersUpdatePasswordInMainPageRequestDto,
  ): Promise<UsersUpdatePasswordInMainPageResponseDto> {
    return await this.usersService.updatePasswordInMainPage(usersUpdateDto);
  }

  @Post("password-check")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: "확인",
    description: "user의 비밀번호를 확인",
  })
  @ApiOkResponse({
    description: "확인된 정보를 반환",
    type: UsersVerifyPasswordResponseDto,
  })
  async verifyPassword(
    @Body() usersUpdateDto: UsersVerifyPasswordRequestDto,
    @Headers("authorization") rawToken: string,
  ): Promise<UsersVerifyPasswordResponseDto> {
    return await this.usersService.verifyPassword(usersUpdateDto, rawToken);
  }

  @Delete("/:id")
  @UseGuards(AccessTokenGuard)
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

  @Patch("/profile-image")
  @UseInterceptors(
    FilesInterceptor("profile-image", 1, multerOptions("images")),
  )
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: "유저 프로필 이미지 수정",
    description: "유저 프로필 이미지 수정",
  })
  async updateProfileImage(
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Headers("authorization") rawToken: string,
  ): Promise<UsersUpdateProfileResponseDto> {
    return await this.usersService.updateProfileImage(file[0], rawToken);
  }
}
