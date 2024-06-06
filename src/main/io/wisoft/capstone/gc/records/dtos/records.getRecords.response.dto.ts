import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

class ImageDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  constructor(id: string, imageUrl: string) {
    this.id = id;
    this.imageUrl = imageUrl;
  }
}

class RecordDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  image: ImageDTO[];

  constructor(
    id: string,
    title: string,
    location: string,
    startTime: string,
    endTime: string,
    createdAt: Date,
    content: string,
    userId: number,
    image: ImageDTO[],
  ) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.startTime = startTime;
    this.endTime = endTime;
    this.createdAt = createdAt;
    this.content = content;
    this.userId = userId;
    this.image = image;
  }
}

export class RecordsGetRecordsResponseDto {
  @ValidateNested()
  @Type(() => RecordDTO)
  record: RecordDTO | null;

  constructor(record: RecordDTO | null) {
    this.record = record;
  }
}
