import { UpdateProfileDto } from '../student/dto/update-profile.dto';

export interface UpdateStudentResponse {
   UpdateStudentStatus: string;
}

export interface DeleteStudentResponse {
   DeleteStudentStatus: string;
}

interface CreatedRandomUser {
   no: string;
   id: string;
   email: string;
}

export interface ImportRandomStudentsResponse {
   createdUsersList: CreatedRandomUser[];
}

export interface UpdateStudentProfile {
   studentStatus: string;
   tel: string;
   firstName: string;
   lastName: string;
   githubUserName: string;
   portfolioUrls: string[];
   projectUrls: string[];
   bio: string;
   expectedTypeOfWork: string;
   targetWorkCity: string;
   expectedContractType: string;
   expectedSalary: string;
   canTakeApprenticeship: string;
   monthsOfCommercialExp: number;
   education: string;
   workExperience: string;
   courses: string;
}
