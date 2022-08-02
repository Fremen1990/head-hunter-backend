export enum WorkType {
   OFFICE = 'office',
   READY_TO_MOVE = 'ready_to_move',
   REMOTE = 'remote',
   HYBRID = 'hybrid',
   ANY = 'any',
}

export const validateWorkType = (worktype: string): string => {
   if (worktype.toUpperCase() === WorkType.OFFICE) {
      return 'office';
   }
   if (worktype.toLowerCase() === WorkType.READY_TO_MOVE) {
      return 'ready_to_move';
   }
   if (worktype.toLowerCase() === WorkType.REMOTE) {
      return 'remote';
   }
   if (worktype.toLowerCase() === WorkType.HYBRID) {
      return 'hybrid';
   }
   if (worktype.toLowerCase() === WorkType.ANY) {
      return 'any';
   }

   return 'WRONG WROKTYPE -> USE: office | ready to move| remote | hybrid | any';
};