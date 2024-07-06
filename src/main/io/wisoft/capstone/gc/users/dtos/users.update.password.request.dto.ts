import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdatePasswordRequestDto {
  @ApiProperty({
    example: "password",
    description: "password",
    required: true,
  })
  password: string;
}
