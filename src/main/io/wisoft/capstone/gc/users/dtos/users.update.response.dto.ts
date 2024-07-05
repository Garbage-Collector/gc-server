import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdateResponseDto {
  @ApiProperty({
    example: "nickname",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
