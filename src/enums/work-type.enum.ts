export enum WorkType {
   office = 'OFFICE',
   readyToMove = 'READY_TO_MOVE',
   remote = 'REMOTE',
   hybrid = 'HYBRID',
   any = 'ANY',
}

export const validateWorkType = (worktype: string): string => {
   if (worktype.toUpperCase() === WorkType.office) {
      return 'OFFICE';
   }
   if (worktype.toUpperCase() === WorkType.readyToMove) {
      return 'READY_TO_MOVE';
   }
   if (worktype.toUpperCase() === WorkType.remote) {
      return 'REMOTE';
   }
   if (worktype.toUpperCase() === WorkType.hybrid) {
      return 'HYBRID';
   }
   if (worktype.toUpperCase() === WorkType.any) {
      return 'ANY';
   }

   return 'WRONG WROKTYPE -> USE: office | ready to move| remote | hybrid | any';
};
