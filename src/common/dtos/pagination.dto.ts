import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page number must be an integer' })
  @Min(1, { message: 'Page number must be at least 1' })
  pageNumber?: number;
}
