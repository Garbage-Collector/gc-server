import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UsersSignupResponseDto {
  @ApiProperty({
    example: "201",
    description: "httpStatus",
    required: true,
  })
  status: HttpStatus;
}
