import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdateNicknameResponseDto {
  @ApiProperty({
    example: "nickname",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
