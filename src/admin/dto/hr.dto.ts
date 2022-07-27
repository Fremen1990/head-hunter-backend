import { IsNumber, IsString } from 'class-validator';

export class HrDto {
   @IsString()
   email?: string;
   @IsString()
   pwd?: string;
   @IsString()
   fullName: string;
   @IsString()
   company: string;
   @IsNumber()
   maxReservedStudents: number;
}
