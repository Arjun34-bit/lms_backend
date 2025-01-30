import { IsMongoId, IsNotEmpty } from 'class-validator';
import { JwtDto } from 'src/common/dtos/jwt.dto';

export class InstructorJwtDto extends JwtDto {
  @IsNotEmpty()
  @IsMongoId()
  instructorId: string;
}
