import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdatePasswordResponseDto {
  @ApiProperty({
    example: "password",
    description: "password",
    required: true,
  })
  password: string;
}
