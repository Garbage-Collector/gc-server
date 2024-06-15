import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateRequestDto } from "@gc/users/dtos/users.update.request.dto";
import { UsersUpdateResponseDto } from "@gc/users/dtos/users.update.response.dto";
import { UsersService } from "@gc/users/users.service";
import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
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
  async signup(
    @Body() usersSignupDto: UsersSignupRequestDto,
  ): Promise<UsersSignupResponseDto> {
    return await this.usersService.signup(usersSignupDto);
  }

  @Post("/signin")
  @ApiOperation({
    summary: "로그인",
    description: "아이디와 비밀번호로 유저 로그인 진행, id 반환",
  })
  async signin(
    @Body() usersSigninDto: UsersSigninRequestDto,
  ): Promise<UsersSigninResponseDto> {
    return await this.usersService.signin(usersSigninDto);
  }

  @Patch("")
  @ApiOperation({
    summary: "수정",
    description: "user을 수정함",
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
  async deleteUser(@Param("id") id: string): Promise<UsersDeleteResponseDto> {
    return await this.usersService.delete({ id: Number.parseInt(id) });
  }
}
