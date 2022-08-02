import { IsEnum, IsNumber, IsString } from 'class-validator';
import { WorkType } from '../../enums/work-type.enum';
import { StudentStatus } from '../../enums/student-status.enum';
import { ContactType } from '../../enums/contract-type.enum';
import { Apprenticeship } from '../../enums/apprenticeship.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
   @ApiProperty({
      type: String,
      description: 'Student status',
      example: 'available',
   })
   @IsEnum(StudentStatus)
   studentStatus: string;

   @ApiProperty({
      type: String,
      description: 'Student telephone number',
      example: '666-666-666',
   })
   @IsString()
   tel: string;

   @ApiProperty({
      type: String,
      description: 'First name',
      example: 'Jakub',
   })
   @IsString()
   firstName: string;

   @ApiProperty({
      type: String,
      description: 'Last name',
      example: 'Mocarny',
   })
   @IsString()
   lastName: string;

   @ApiProperty({
      type: String,
      description: 'GitHub profile user name',
      example: 'fremen1990',
   })
   @IsString()
   githubUserName: string;

   @ApiProperty({
      type: String,
      description: 'Portfolio links / urls',
      example: '[https://www.devthomas.pl, https://netflix-app-69791.web.app]',
   })
   @IsString({ each: true })
   portfolioUrls: string[];

   @ApiProperty({
      type: String,
      description: 'Project Urls',
      example:
         '[https://github.com/Fremen1990/head-hunter-backend, https://github.com/Fremen1990/head-hunter-frontend]',
   })
   @IsString({ each: true })
   projectUrls: string[];

   @ApiProperty({
      type: String,
      description: 'Shor biography about',
      example:
         'Learning Web Development in JavaScript for more than 2 years now, IT lover, just changed carrer from Finance to IT.',
   })
   @IsString()
   bio: string;

   @ApiProperty({
      type: String,
      description: 'Expectations regarding type of work',
      example: 'any',
   })
   @IsEnum(WorkType)
   expectedTypeOfWork: string;

   @ApiProperty({
      type: String,
      description: 'Target city where you would like to work',
      example: 'Warsaw / Gdansk / Cracov',
   })
   @IsString()
   targetWorkCity: string;

   @ApiProperty({
      type: String,
      description: 'Expected contract type',
      example: 'UoP / B2B',
   })
   @IsEnum(ContactType)
   expectedContractType: string;

   @ApiProperty({
      type: String,
      description: 'Expected salary which will satisfy you',
      example: '8000 PLN',
   })
   @IsString()
   expectedSalary: string;

   @ApiProperty({
      type: String,
      description: 'Can student take apprenticeship',
      example: 'no',
   })
   @IsEnum(Apprenticeship)
   canTakeApprenticeship: string;

   @ApiProperty({
      type: String,
      description: 'Months of commercial experience',
      example: '5 months',
   })
   @IsNumber()
   monthsOfCommercialExp: number;

   @ApiProperty({
      type: String,
      description: 'Student education',
      example: 'Master Degree',
   })
   @IsString()
   education: string;

   @ApiProperty({
      type: String,
      description: 'Student work experience',
      example: 'Finance and accounting',
   })
   @IsString()
   workExperience: string;

   @ApiProperty({
      type: String,
      description: 'Students finished courses',
      example: 'MEGAK StudiujeIT',
   })
   @IsString()
   courses: string;
}
