// do modyfikacji co jest potrzebne dla Hr-owca
import { Hr } from 'src/hr/entities/hr.entity';
import { User } from '../user/entities/user.entity';

export interface HrCandidateListResponse {
   id: string;
   email: string;
   courseCompletion: number;
   courseEngagement: number;
   projectDegree: number;
   teamProjectDegree: number;
   bonusProjectUrls: string[];
   studentStatus: string;
   tel: string;
   firstName: string;
   lastName: string;
   githubUserName: string;
   portfolioUrls: string;
   projectUrls: string;
   bio: string;
   expectedTypeOfWork: string;
   targetWorkCity: string;
   expectedContractType: string;
   expectedSalary: string;
   canTakeApprenticeship: string;
   monthsOfCommercialExp: string;
   education: string;
   workExperience: number;
   courses: string;
}

export interface HrCandidateAddResponse {
   // id: string;
   // // email: string;
   // firstName: string;
   // lastName: string;
   // // portfolioUrls: string;
   // portfolioUrls: string[];
   interview: string;
   interviewId: string;
}

export interface HrCandidateRemoveResponse {
   id: string;
   // email: string;
   firstName: string;
   lastName: string;
}

export type HrType = typeof Hr;
