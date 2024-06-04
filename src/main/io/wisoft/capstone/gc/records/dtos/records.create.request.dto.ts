import { IsNotEmpty } from "class-validator";

export class RecordsCreateRequestDto {
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

  // @IsNotEmpty()
  // images: Express.Multer.File[];
}
