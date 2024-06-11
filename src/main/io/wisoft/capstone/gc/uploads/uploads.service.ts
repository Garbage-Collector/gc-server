import { copyToSrcUpload } from "@gc/utils/image.copy";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class UploadsService {
  // 이미지 생성
  async uploadImg(
    files: Express.Multer.File[],
    recordId: string,
  ): Promise<void> {
    for (const file of files) {
      const fileName = `/media/images/${file.filename}`;

      await prisma.image.create({
        data: {
          imageUrl: fileName,
          recordId: recordId,
        },
      });

      try {
        await copyToSrcUpload(file.filename);
      } catch (error) {
        console.error("이미지 복사 실패", error);
      }
    }
  }

  // 이미지 수정
  async updateImg(
    files: Express.Multer.File[],
    recordId: string,
  ): Promise<void> {
    await prisma.image.deleteMany({
      where: {
        recordId: recordId,
      },
    });

    for (const file of files) {
      const fileName = `/media/images/${file.filename}`;

      await prisma.image.create({
        data: {
          imageUrl: fileName,
          recordId: recordId,
        },
      });
    }
  }
}
