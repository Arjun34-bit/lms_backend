import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TestQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @IsNotEmpty()
  @IsNumber()
  testNumber: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestQuestionDto)
  questions: TestQuestionDto[];
}
