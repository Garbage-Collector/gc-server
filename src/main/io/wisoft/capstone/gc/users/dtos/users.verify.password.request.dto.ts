import { ApiProperty } from "@nestjs/swagger";

export class UsersVerifyPasswordRequestDto {
  @ApiProperty({
    example: "password",
    description: "password",
    required: true,
  })
  password: string;
}
