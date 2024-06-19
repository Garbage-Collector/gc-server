import { ApiProperty } from "@nestjs/swagger";

export class UsersSignupRequestDto {
  @ApiProperty({
    example: "gcgc@hanbat.ac.kr",
    description: "email",
    required: true,
  })
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    example: "iamgc2",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
