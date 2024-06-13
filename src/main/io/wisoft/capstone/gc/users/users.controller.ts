import { UsersDeleteResponseDto } from "@gc/users/dtos/users.delete.response.dto";
import { UsersSigninRequestDto } from "@gc/users/dtos/users.signin.request.dto";
import { UsersSigninResponseDto } from "@gc/users/dtos/users.signin.response.dto";
import { UsersSignupRequestDto } from "@gc/users/dtos/users.signup.request.dto";
import { UsersSignupResponseDto } from "@gc/users/dtos/users.signup.response.dto";
import { UsersUpdateRequestDto } from "@gc/users/dtos/users.update.request.dto";
import { UsersUpdateResponseDto } from "@gc/users/dtos/users.update.response.dto";
import { UsersService } from "@gc/users/users.service";
import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";

@Controller("/api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/signup")
  async signup(
    @Body() usersSignupDto: UsersSignupRequestDto,
  ): Promise<UsersSignupResponseDto> {
    return await this.usersService.signup(usersSignupDto);
  }

  @Post("/signin")
  async signin(
    @Body() usersSigninDto: UsersSigninRequestDto,
  ): Promise<UsersSigninResponseDto> {
    return await this.usersService.signin(usersSigninDto);
  }

  @Patch("")
  async updateUserNickname(
    @Body() usersUpdateDto: UsersUpdateRequestDto,
  ): Promise<UsersUpdateResponseDto> {
    return await this.usersService.updateNickname(usersUpdateDto);
  }

  @Delete("/:id")
  async deleteUser(@Param("id") id: string): Promise<UsersDeleteResponseDto> {
    return await this.usersService.delete({ id: Number.parseInt(id) });
  }
}
