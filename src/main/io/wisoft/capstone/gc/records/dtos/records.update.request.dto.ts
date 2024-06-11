import { IsNotEmpty } from "class-validator";

export class RecordsUpdateRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  content: string;
}
