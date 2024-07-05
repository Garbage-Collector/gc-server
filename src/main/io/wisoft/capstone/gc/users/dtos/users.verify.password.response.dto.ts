import { ApiProperty } from "@nestjs/swagger";

export class UsersVerifyPasswordResponseDto {
  @ApiProperty({
    example: "true/false",
    description: "verified",
    required: true,
  })
  verified: boolean;
}
