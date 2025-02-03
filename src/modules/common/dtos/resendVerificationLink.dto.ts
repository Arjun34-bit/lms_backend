import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailVerificationLinkDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
