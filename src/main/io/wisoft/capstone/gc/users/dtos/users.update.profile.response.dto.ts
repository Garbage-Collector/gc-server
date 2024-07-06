import { ApiProperty } from "@nestjs/swagger";

export class UsersUpdateProfileResponseDto {
  @ApiProperty({
    example: "profile-image url",
    description: "profile-image url",
    required: true,
  })
  profile: string;
}
