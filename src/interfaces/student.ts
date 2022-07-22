export enum Active {
   available = 'available',
   inProgress = 'inProgress',
   hired = 'hired',
}
export enum ContractType {
   contract,
   civilContract,
   b2B,
   contractForSpecificWork,
   noPreference,
}
export enum WorkType {
   office,
   remote,
}

export type Course = {
   year: number;
   name: string;
};

export interface StudentInterface {
   id: string;
   email: string;
   pwdHash: string;
   registerTokenId: string | null;
   currentSessionTokenId: string | null;
   active: boolean;
   status: Active;
   courseCompletion: number;
   courseEngagement: number;
   projectDegree: number;
   teamProjectDegree: number;
   preferredWorkType: WorkType;
   preferredCity: string;
   contractType: ContractType;
   minSalary: number | null;
   maxSalary: number | null;
   freeInternship: boolean;
   comExperience: number | null;
   courses: Course[];
   education: string | null;
   aboutMe: string | null;
   workExperience: string | null;
   bonusProjectUrls: string;
   endMegaKProjectUrls: string;
   portfolioUrls: string | null;
}

export interface RegisterStudentResponse {
   id: string;
   registerTokenId: string | null;
   active: boolean;
}
