import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class RecordsHttpStatusDto {
  @ApiProperty()
  status: HttpStatus;
}
