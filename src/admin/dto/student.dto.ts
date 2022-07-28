import { IsNumber, IsString } from 'class-validator';

export class StudentDto {
   @IsString()
   email: string;
   @IsString()
   pwd?: string;
   @IsString()
   role: string;
   @IsNumber()
   courseCompletion: number;
   @IsNumber()
   courseEngagement: number;
   @IsNumber()
   projectDegree: number;
   @IsNumber()
   teamProjectDegree: number;
   @IsString()
   bonusProjectUrls: string[];
}
