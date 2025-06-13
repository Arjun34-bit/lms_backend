import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsMongoId()
    @IsNotEmpty()
    departmentId: string;
}