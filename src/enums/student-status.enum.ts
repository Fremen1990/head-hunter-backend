export enum StudentStatus {
   available = 'AVAILABLE',
   interview = 'INTERVIEW',
   employeed = 'EMPLOYEED',
}

export const validateStudentStatus = (status: string): string => {
   if (status.toUpperCase() === StudentStatus.available) {
      return 'AVAILABLE';
   }
   if (status.toUpperCase() === StudentStatus.interview) {
      return 'INTERVIEW';
   }
   if (status.toUpperCase() === StudentStatus.employeed) {
      return 'EMPLOYEED';
   }

   return 'WRONG STATUS -> USE: available | interview | employeed';
};
