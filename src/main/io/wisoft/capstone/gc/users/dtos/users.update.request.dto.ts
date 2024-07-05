import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdateRequestDto {
  @ApiProperty({
    example: "nickname",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
