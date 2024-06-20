import { ApiProperty } from "@nestjs/swagger";

export class MailSendResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  "verify-code": number;
}
