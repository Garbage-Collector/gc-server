import { ApiProperty } from "@nestjs/swagger";

export class UsersDeleteRequestDto {
  @ApiProperty({
    example: "1",
    description: "id",
    required: true,
  })
  id: number;
}
