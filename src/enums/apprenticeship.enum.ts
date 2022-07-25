export enum Apprenticeship {
   yes = 'YES',
   no = 'NO',
}

export const validateApprenticeship = (agreement: string): string => {
   if (agreement.toUpperCase() === Apprenticeship.yes) {
      return 'YES';
   }
   if (agreement.toUpperCase() === Apprenticeship.no) {
      return 'NO';
   }

   return 'SELECT YES OR NO';
};
