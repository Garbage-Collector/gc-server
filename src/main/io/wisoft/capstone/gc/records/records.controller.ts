import { Controller, Delete, Get, Post, Put } from "@nestjs/common";

@Controller("records")
export class RecordsController {
  // 기록 생성
  @Post()
  async createRecord(): Promise<string> {
    return "기록 생성하기";
  }

  @Get()
  // 기록 다건 조회
  async getAllRecords(): Promise<string> {
    return "기록 다건 조회하기";
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
