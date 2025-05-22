import { IsString, IsNotEmpty } from 'class-validator';

export class AdminPhoneLoginDto {

  @IsString()
  @IsNotEmpty()
  idToken: string;
}