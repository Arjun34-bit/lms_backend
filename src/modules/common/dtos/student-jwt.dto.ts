import { IsMongoId, IsNotEmpty } from 'class-validator';
import { JwtDto } from 'src/common/dtos/jwt.dto';

export class StudentJwtDto extends JwtDto {
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;
}
