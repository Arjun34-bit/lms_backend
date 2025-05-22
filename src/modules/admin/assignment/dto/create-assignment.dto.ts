import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssignmentQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  assignmentName: string;

  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions: AssignmentQuestionDto[];
}
