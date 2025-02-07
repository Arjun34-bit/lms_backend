import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BuyCourseDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}
