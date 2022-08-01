export enum StudentStatus {
   AVAILABLE = 'available',
   INTERVIEW = 'interview',
   EMPLOYED = 'employed',
}

export const validateStudentStatus = (status: string): string => {
   if (status.toLowerCase() === StudentStatus.AVAILABLE) {
      return 'available';
   }
   if (status.toLowerCase() === StudentStatus.INTERVIEW) {
      return 'interview';
   }
   if (status.toLowerCase() === StudentStatus.EMPLOYED) {
      return 'employed';
   }

   return 'WRONG STATUS -> USE: available | interview | employed';
};
