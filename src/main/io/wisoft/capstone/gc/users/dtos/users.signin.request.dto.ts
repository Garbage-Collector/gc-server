import { ApiProperty } from "@nestjs/swagger";

export class UsersSigninRequestDto {
  @ApiProperty({
    example: "gcgc@hanbat.ac.kr",
    description: "email",
    required: true,
  })
  email: string;
  @ApiProperty({
    description: "password",
    required: true,
  })
  password: string;
}
