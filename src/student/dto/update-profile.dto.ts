import { IsNumber, IsString } from 'class-validator';

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

   @IsString()
   portfolioUrls: string;

   @IsString()
   projectUrls: string;

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

   @IsString()
   monthsOfCommercialExp: string;

   @IsString()
   education: string;

   @IsString()
   workExperience: string;

   @IsString()
   courses: string;
}
