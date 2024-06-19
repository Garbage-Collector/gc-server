import { ApiProperty } from "@nestjs/swagger";

export class UsersSigninResponseDto {
  @ApiProperty({
    example: "1",
    description: "id",
    required: true,
  })
  id: number;

  @ApiProperty({
    example: "iamgc2",
    description: "nickname",
    required: true,
  })
  nickname: string;

  @ApiProperty({
    example:
      "[\n" +
      '        "351e085a-dee4-44c4-8a29-6372810728fa",\n' +
      '        "f89e9513-45b8-45df-ac49-322d87243050",\n' +
      '        "170b4297-b379-423b-9668-41881de7eab4",\n' +
      '        "dd5a9add-3c92-4fa5-a70a-986b907286c4"\n' +
      "    ]",
    description: "recordIds",
    required: true,
  })
  recordIds: string[];
}
