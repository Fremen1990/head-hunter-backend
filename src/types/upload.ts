export interface UploadFileResponseInterface {
   email: string;
   role: string;
   courseCompletion: number;
   courseEngagement: number;
   projectDegree: number;
   teamProjectDegree: number;
   bonusProjectUrls: string[];
}

export interface UploadFileFailedInterface {
   UploadStatus: string;
   Error: string;
}
