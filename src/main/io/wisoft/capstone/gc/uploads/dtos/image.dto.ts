import { IsString } from "class-validator";

export class ImageDTO {
  @IsString()
  id: string;

  @IsString()
  imageUrl: string;
}
