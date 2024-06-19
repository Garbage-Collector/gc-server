import { RecordsCreateValidationPipe } from "@gc/pipes/records/records.create.validation.pipe";
import { RecordsCreateRequestDto } from "@gc/records/dtos/records.create.request.dto";
import { RecordsCreateResponseDto } from "@gc/records/dtos/records.create.response.dto";
import { RecordsGetRecordResponseDto } from "@gc/records/dtos/records.getRecord.response.dto";
import { RecordsHttpStatusDto } from "@gc/records/dtos/records.http.status.dto";
import { RecordsUpdateRequestDto } from "@gc/records/dtos/records.update.request.dto";
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
  UsePipes,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { ApiNoContentResponse } from "@nestjs/swagger/dist/decorators/api-response.decorator";

@Controller("/api/records")
@ApiTags("Records API")
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  // 기록 생성
  @Post("/:userId")
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions("images")))
  @ApiOperation({
    summary: "기록 생성",
    description:
      "기록을 생성할 때는 title, location, startTime, endTime, createdAt, content, image 가 필요",
  })
  @ApiCreatedResponse({
    description: "기록에 대한 고유한 ID 생성함",
    type: RecordsCreateResponseDto,
  })
  async createRecord(
    @Body(RecordsCreateValidationPipe)
    recordsCreateRequestDto: RecordsCreateRequestDto,
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
  @Get("/:userId")
  @ApiOperation({
    summary: "한 명의 사용자에 대한 기록 조회(多)",
    description:
      "한 명의 사용자에 대한 모든 기록을 보여줌(지금은 사용자가 한 명이기 때문에 userId가 필요)",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    description: "userId는 number로 접근함",
  })
  @ApiCreatedResponse({
    description: "한 명의 사용자에 대한 모든 기록을 보여줌",
    // TODO: 배열로 표현하는 방법에 대한 고민 필요
    type: RecordsGetRecordResponseDto,
  })
  async getAllRecords(
    @Param("userId") param: string,
  ): Promise<RecordsGetRecordResponseDto[]> {
    return await this.recordService.getAllRecords(Number.parseInt(param));
  }

  // 기록 단건 조회
  @Get("/:userId/:recordId")
  @ApiOperation({
    summary: "한 명의 사용자에 대한 기록 조회(少)",
    description: "한 명의 사용자에 대한 하나의 기록을 보여줌",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    description: "userId는 number로 접근함",
  })
  @ApiParam({
    name: "recordId",
    type: "string",
    description: "(기록 uuid)1666b109-ea53-4db8-8cc7-903c87453425",
  })
  @ApiOkResponse({
    description: "한 명의 사용자에 대한 하나 기록을 보여줌",
    type: RecordsGetRecordResponseDto,
  })
  async getRecord(
    @Param("userId") userId: string,
    @Param("recordId") recordId: string,
  ): Promise<RecordsGetRecordResponseDto> {
    return await this.recordService.getRecord(
      Number.parseInt(userId),
      recordId,
    );
  }

  // 기록 수정
  @Put("/:recordId")
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions("images")))
  @ApiOperation({
    summary: "기록에 대한 수정",
    description: "기록을 수정할 수 있음",
  })
  @ApiOkResponse({})
  async updateRecord(
    @Param("recordId") recordId: string,
    @Body() updateRecordDto: RecordsUpdateRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<RecordsHttpStatusDto> {
    return await this.recordService.setRecord(recordId, updateRecordDto, files);
  }

  // 기록 삭제
  @Delete("/:recordId")
  @ApiOperation({
    summary: "기록 삭제",
    description: "한 명의 사용자에 대한 기록을 지움",
  })
  @ApiParam({
    name: "recordId",
    type: "string",
    description: "(기록 uuid)1666b109-ea53-4db8-8cc7-903c87453425",
  })
  @ApiNoContentResponse({})
  async removeRecord(
    @Param("recordId") param: string,
  ): Promise<RecordsHttpStatusDto> {
    return await this.recordService.removeRecord(param);
  }
}
