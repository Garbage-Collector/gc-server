import { ImageDTO } from "@gc/uploads/dtos/image.dto";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class RecordsGetRecordResponseDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  content: string;

  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  @IsOptional()
  image?: ImageDTO[];
}
