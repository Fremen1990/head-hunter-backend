export enum StudentStatus {
   available = 'AVAILABLE',
   interview = 'INTERVIEW',
   employed = 'EMPLOYED',
}

export const validateStudentStatus = (status: string): string => {
   if (status.toUpperCase() === StudentStatus.available) {
      return 'AVAILABLE';
   }
   if (status.toUpperCase() === StudentStatus.interview) {
      return 'INTERVIEW';
   }
   if (status.toUpperCase() === StudentStatus.employed) {
      return 'EMPLOYED';
   }

   return 'WRONG STATUS -> USE: available | interview | employed';
};
