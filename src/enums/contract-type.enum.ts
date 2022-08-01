export enum ContactType {
   UOP = 'uop',
   B2B = 'b2b',
   UZ_UOD = 'uz_uod',
   ANY = 'any',
}

export const validateContractType = (contactType: string): string => {
   if (contactType.toLowerCase() === ContactType.UOP) {
      return 'uop';
   }
   if (contactType.toLowerCase() === ContactType.B2B) {
      return 'b2b';
   }
   if (contactType.toLowerCase() === ContactType.UZ_UOD) {
      return 'uz_uod';
   }
   if (contactType.toLowerCase() === ContactType.ANY) {
      return 'any';
   }
   return 'WRONG CONTRACT TYPE -> uop | b2b | uz_uod | any';
};
