import { UploadsCreateRequestDto } from "@gc/uploads/dtos/uploads.create.request.dto";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class UploadsService {
  // 이미지 생성
  async uploadImg(uploadCreateDto: UploadsCreateRequestDto): Promise<void> {
    for (const file of uploadCreateDto.files) {
      // const fileName = `http://localhost:3000/media/images/${file.filename}`;
      const fileName = `/media/images/${file.filename}`;

      await prisma.image.create({
        data: {
          imageUrl: fileName,
          recordId: uploadCreateDto.recordId,
        },
      });
    }
  }

  // 이미지 수정
}
