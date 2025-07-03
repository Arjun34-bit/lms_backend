import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetCourseDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}
