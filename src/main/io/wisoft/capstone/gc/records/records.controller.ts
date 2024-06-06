import { RecordsCreateRequestDto } from "@gc/records/dtos/records.create.request.dto";
import { RecordsCreateResponseDto } from "@gc/records/dtos/records.create.response.dto";
import { RecordsGetAllRecordsResponseDto } from "@gc/records/dtos/records.getAllRecords.response.dto";
import { RecordsService } from "@gc/records/records.service";
import { multerOptions } from "@gc/utils/multer.options";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("/api/records")
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  // 기록 생성
  @Post(":userId")
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions("images")))
  async createRecord(
    @Body() recordsCreateRequestDto: RecordsCreateRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param("userId") userId: string,
  ): Promise<RecordsCreateResponseDto> {
    return await this.recordService.createRecord(
      recordsCreateRequestDto,
      files,
      Number.parseInt(userId),
    );
  }

  // 기록 다건 조회
  @Get(":userId")
  async getAllRecords(
    @Param("userId") param: string,
  ): Promise<RecordsGetAllRecordsResponseDto> {
    return await this.recordService.getAllRecords(Number.parseInt(param));
  }

  @Get()
  // 기록 단건 조회
  async getRecord(): Promise<string> {
    return "기록 단건 조회하기";
  }

  @Put()
  // 기록 수정
  async updateRecord(): Promise<string> {
    return "기록 수정하기";
  }

  @Delete()
  // 기록 삭제
  async removeRecord(): Promise<string> {
    return "기록 삭제하기";
  }
}
