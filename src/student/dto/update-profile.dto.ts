import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { WorkType } from '../../enums/work-type.enum';
import { StudentStatus } from '../../enums/student-status.enum';
import { ContactType } from '../../enums/contract-type.enum';
import { Apprenticeship } from '../../enums/apprenticeship.enum';

export class UpdateProfileDto {
   @IsEnum(StudentStatus)
   studentStatus: string;

   @IsString()
   tel: string;

   @IsString()
   firstName: string;

   @IsString()
   lastName: string;

   @IsString()
   githubUserName: string;

   // nie możemy zwracać null, co najwyżej tablica może być pusta
   @IsString({ each: true })
   portfolioUrls: string[];

   @IsString({ each: true })
   projectUrls: string[];

   @IsString()
   bio: string;

   @IsEnum(WorkType)
   expectedTypeOfWork: string;

   @IsString()
   targetWorkCity: string;

   @IsEnum(ContactType)
   expectedContractType: string;

   @IsString()
   expectedSalary: string;

   @IsEnum(Apprenticeship)
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
