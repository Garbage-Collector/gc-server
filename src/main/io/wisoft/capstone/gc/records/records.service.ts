import { RecordsCreateRequestDto } from "@gc/records/dtos/records.create.request.dto";
import { RecordsCreateResponseDto } from "@gc/records/dtos/records.create.response.dto";
import { RecordsGetAllRecordsResponseDto } from "@gc/records/dtos/records.getAllRecords.response.dto";
import { UploadsService } from "@gc/uploads/uploads.service";
import { Injectable } from "@nestjs/common";
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
      console.error("등록 실패", error);
      throw error;
    }
  }

  // 기록 다건 조회
  async getAllRecords(
    userId: number,
  ): Promise<RecordsGetAllRecordsResponseDto> {
    try {
      const records = await prisma.record.findMany({
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

      return {
        records,
      };
    } catch (error) {
      console.error("찾기 실패:", error);
      throw new Error("기록 찾기 실패...");
    }
  }

  // 기록 단건 조회
  // 기록 수정
  // 기록 삭제
}
