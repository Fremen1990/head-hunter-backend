import { IsNumber, IsString } from 'class-validator';

export class ImportUserDto {
   // warning!  file csv for upload converted to lower-case!!!!!!

   @IsString()
   email: string;
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
