import { IsObject } from 'class-validator';

export class HrFilterResultsDto {
   @IsObject()
   newObj: {
      canTakeApprenticeship: string;
      courseCompletion: string[];
      courseEngagement: string[];
      expectedContractType: string[];
      expectedSalary: {
         min: number | null;
         max: number | null;
      };
      expectedTypeOfWork: string[];
      monthsOfCommercialExp: number;
      projectDegree: string[];
      teamProjectDegree: string[];
   };
}
