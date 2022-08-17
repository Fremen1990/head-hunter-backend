// do modyfikacji co jest potrzebne dla Hr-owca
import { Hr } from 'src/hr/entities/hr.entity';
import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Interview } from '../hr/entities/interview.entity';

export interface HrSimpleResponse {
   message: string;
}

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

export interface GetOneHrProfileResponse {
   hr: {
      id: string;
      email: string;
      encryptedPwd;
      role: string;
      currentSessionToken: string | null;
      registrationToken: string;
      resetPasswordToken: string;
      active: boolean;
      created_at: Date;
      updated_at: Date;

      hr?: Hr;
   };
   openInterviews: Interview[] | string;
}

export interface GetOneHrInterviewsResponse {
   interviewId: string;
   interviewTitle: string;
   date: Date;
   studentId: string;
   hrId: string;

   student: Student;
}
export type HrType = typeof Hr;
