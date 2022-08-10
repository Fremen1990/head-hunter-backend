export const generateReservationDate = (): string => {
   const date = new Date();

   const dateString = new Date(
      date.getTime() + 864000000 - date.getTimezoneOffset() * 60000,
   )
      .toISOString()
      .split('T')[0];

   return dateString;
};

export const getTodayDateString = (): string => {
   const date = new Date();

   const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
   )
      .toISOString()
      .split('T')[0];

   return dateString;
};
