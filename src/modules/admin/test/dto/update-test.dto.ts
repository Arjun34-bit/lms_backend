import { IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TestQuestionDto {
  @IsOptional()
  @IsString()
  question: string;
}

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  subjectName?: string;

  @IsOptional()
  @IsNumber()
  testNumber?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestQuestionDto)
  questions?: TestQuestionDto[];
}
