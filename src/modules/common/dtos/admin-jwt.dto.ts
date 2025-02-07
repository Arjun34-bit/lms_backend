import { IsMongoId, IsNotEmpty } from 'class-validator';
import { JwtDto } from 'src/common/dtos/jwt.dto';

export class AdminJwtDto extends JwtDto {
  @IsNotEmpty()
  @IsMongoId()
  adminId: string;
}
