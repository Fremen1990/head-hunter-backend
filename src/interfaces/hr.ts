// do modyfikacji co jest potrzebne dla Hr-owca
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
   id: string;
   email: string;
   firstName: string;
   lastName: string;
   portfolioUrls: string;
}

export interface HrCandidateRemoveResponse {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
}
