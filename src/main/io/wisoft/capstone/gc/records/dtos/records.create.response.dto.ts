import { ApiProperty } from "@nestjs/swagger";

export class RecordsCreateResponseDto {
  @ApiProperty()
  recordId: string;
}
