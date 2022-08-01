export enum ContactType {
   UOP = 'UoP',
   B2B = 'B2B',
   UZ_UOD = 'UZ_UoD',
   ANY = 'any',
}

export const validateContractType = (contactType: string): string => {
   if (contactType.toLowerCase() === ContactType.UOP) {
      return 'UoP';
   }
   if (contactType.toLowerCase() === ContactType.B2B) {
      return 'B2B';
   }
   if (contactType.toLowerCase() === ContactType.UZ_UOD) {
      return 'UZ_UoD';
   }
   if (contactType.toLowerCase() === ContactType.ANY) {
      return 'any';
   }
   return 'WRONG CONTRACT TYPE -> UoP | B2B | UZ_UoD | any';
};
