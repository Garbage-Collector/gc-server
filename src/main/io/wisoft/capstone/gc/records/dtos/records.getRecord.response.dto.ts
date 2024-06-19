import { ImageDTO } from "@gc/uploads/dtos/image.dto";
import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  @IsOptional()
  image?: ImageDTO[];
}
