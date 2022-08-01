import { IsArray, IsNumber, IsString } from 'class-validator';
import { StudentStatus } from '../../enums/student-status.enum';

export class UpdateProfileDto {
   @IsString()
   studentStatus: string;

   @IsString()
   tel: string;

   @IsString()
   firstName: string;

   @IsString()
   lastName: string;

   @IsString()
   githubUserName: string;

   @IsArray()
   // portfolioUrls: string;
   portfolioUrls: string[] | null;

   @IsArray()
   // projectUrls: string;
   projectUrls: string[] | null;

   @IsString()
   bio: string;

   @IsString()
   expectedTypeOfWork: string;

   @IsString()
   targetWorkCity: string;

   @IsString()
   expectedContractType: string;

   @IsString()
   expectedSalary: string;

   @IsString()
   canTakeApprenticeship: string;

   @IsNumber()
   monthsOfCommercialExp: number;

   @IsString()
   education: string;

   @IsString()
   workExperience: string;

   @IsString()
   courses: string;
}
