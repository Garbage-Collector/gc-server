import { RecordsCreateRequestDto } from "@gc/records/dtos/records.create.request.dto";
import { BadRequestException, PipeTransform } from "@nestjs/common";

export class RecordsCreateValidationPipe implements PipeTransform {
  async transform(
    recordsCreateRequestDto: RecordsCreateRequestDto,
  ): Promise<RecordsCreateRequestDto> {
    const title = recordsCreateRequestDto.title;
    const location = recordsCreateRequestDto.location;
    const content = recordsCreateRequestDto.content;
    const startTime = recordsCreateRequestDto.startTime;
    const endTime = recordsCreateRequestDto.endTime;

    if (title.length > 50) {
      throw new BadRequestException("제목은 50자 이내여야 합니다.");
    }

    if (location.length > 20) {
      throw new BadRequestException("위치는 20자 이내여야 합니다.");
    }

    if (content.length > 500) {
      throw new BadRequestException("내용은 500자 이내여야 합니다.");
    }

    if (startTime.length > 20 || endTime.length > 20) {
      throw new BadRequestException("시간이 올바르지 않습니다.");
    }

    return recordsCreateRequestDto;
  }
}
