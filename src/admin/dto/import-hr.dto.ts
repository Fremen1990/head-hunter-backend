import { IsNumber, IsString } from 'class-validator';

export class ImportHrDto {
   @IsString()
   email: string;
   @IsNumber()
   fullName: string;
   @IsString()
   company: string;
   @IsNumber()
   maxReservedStudents: number;
}
