import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UploadsCreateRequestDto {
  @IsArray()
  files: Express.Multer.File[];

  @IsString()
  @IsNotEmpty()
  recordId: string;
}
