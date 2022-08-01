export enum Apprenticeship {
   YES = 'yes',
   NO = 'no',
}

export const validateApprenticeship = (agreement: string): string => {
   if (agreement.toLowerCase() === Apprenticeship.YES) {
      return 'yes';
   }
   if (agreement.toLowerCase() === Apprenticeship.NO) {
      return 'no';
   }

   return `SELECT 'yes' or 'not'`;
};
