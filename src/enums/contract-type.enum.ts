export enum ContactType {
   uop = 'UOP',
   b2b = 'B2B',
   uz_uod = 'UZ_UOD',
   any = 'ANY',
}

export const validateContractType = (contactType: string): string => {
   if (contactType.toUpperCase() === ContactType.uop) {
      return 'UOP';
   }
   if (contactType.toUpperCase() === ContactType.b2b) {
      return 'B2B';
   }
   if (contactType.toUpperCase() === ContactType.uz_uod) {
      return 'UZ_UOD';
   }
   if (contactType.toUpperCase() === ContactType.any) {
      return 'ANY';
   }
   return 'WRONG CONTRACT TYPE -> UoP | B2B | UZ/UoD | any';
};
