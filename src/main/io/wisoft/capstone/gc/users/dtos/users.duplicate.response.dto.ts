import { ApiProperty } from "@nestjs/swagger";

export class UsersDuplicateResponseDto {
  @ApiProperty()
  available: boolean;
}
