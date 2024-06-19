import { RecordsCreateRequestDto } from "@gc/records/dtos/records.create.request.dto";
import { RecordsCreateResponseDto } from "@gc/records/dtos/records.create.response.dto";
import { RecordsGetRecordResponseDto } from "@gc/records/dtos/records.getRecord.response.dto";
import { RecordsHttpStatusDto } from "@gc/records/dtos/records.http.status.dto";
import { RecordsUpdateRequestDto } from "@gc/records/dtos/records.update.request.dto";
import { UploadsService } from "@gc/uploads/uploads.service";
import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class RecordsService {
  constructor(private readonly uploadService: UploadsService) {}

  // 기록 생성
  async createRecord(
    createRecordDto: RecordsCreateRequestDto,
    files: Express.Multer.File[],
    user: number,
  ): Promise<RecordsCreateResponseDto> {
    try {
      const record = await prisma.record.create({
        data: {
          title: createRecordDto.title,
          location: createRecordDto.location,
          startTime: createRecordDto.startTime,
          endTime: createRecordDto.endTime,
          content: createRecordDto.content,
          userId: user,
        },
      });

      await this.uploadService.uploadImg(files, record.id);

      return {
        recordId: record.id,
      };
    } catch (error) {
      throw new Error("기록 등록 실패");
    }
  }

  // 기록 다건 조회
  async getAllRecords(userId: number): Promise<RecordsGetRecordResponseDto[]> {
    try {
      return await prisma.record.findMany({
        where: {
          userId: userId,
        },
        include: {
          image: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error("기록 다건 조회 실패");
    }
  }

  // 기록 단건 조회
  async getRecord(
    userId: number,
    recordId: string,
  ): Promise<RecordsGetRecordResponseDto> {
    try {
      const record = await prisma.record.findUnique({
        where: {
          userId: userId,
          id: recordId,
        },
        include: {
          image: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      });

      // TODO: 수정 필요
      if (!record) {
        throw new Error(
          `기록 단건 조회 실패: userId: ${userId} and recordId: ${recordId}`,
        );
      }

      return record;
    } catch (error) {
      throw new Error("기록 단건 조회 실패");
    }
  }

  // 기록 수정
  async setRecord(
    recordId: string,
    updateRecordsDto: RecordsUpdateRequestDto,
    files: Express.Multer.File[],
    statusCode: HttpStatus = HttpStatus.NO_CONTENT,
  ): Promise<RecordsHttpStatusDto> {
    try {
      const updatedRecord = await prisma.record.update({
        where: {
          id: recordId,
        },
        data: {
          title: updateRecordsDto.title,
          location: updateRecordsDto.location,
          content: updateRecordsDto.content,
          startTime: updateRecordsDto.startTime,
          endTime: updateRecordsDto.endTime,
        },
      });

      await this.uploadService.updateImg(files, recordId);

      return { status: statusCode };
    } catch (error) {
      throw new Error("업데이트 실패");
    }
  }

  // 기록 삭제
  async removeRecord(
    recordId: string,
    statusCode: HttpStatus = HttpStatus.NO_CONTENT,
  ): Promise<RecordsHttpStatusDto> {
    try {
      await prisma.record.delete({
        where: {
          id: recordId,
        },
      });

      return { status: statusCode };
    } catch (error) {
      throw new Error("기록 삭제 실패");
    }
  }
}
