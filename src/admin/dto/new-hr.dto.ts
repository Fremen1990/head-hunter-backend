import { IsNumber, IsString } from 'class-validator';

export class registerNewHrDto {
   @IsString()
   email: string;
   @IsString()
   fullName: string;
   @IsNumber()
   company: string;
   @IsNumber()
   maxReservedStudents: number;
}
