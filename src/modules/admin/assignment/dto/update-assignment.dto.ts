import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssignmentQuestionDto {
  @IsOptional()
  @IsString()
  question: string;
}

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  assignmentName?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions?: AssignmentQuestionDto[];
}
