import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdateNicknameRequestDto {
  @ApiProperty({
    example: "nickname",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
