export interface RegisterUserResponse {
   id: string;
   registrationToken: string | null;
   active: boolean;
}

export interface ImportUserResponse {
   // email: string;
   // role: string;
   // registerTokenId: string | null;
   // // active: boolean;
   // studentStatus: string;

   importSuccess: string;
   newUsersCounter: number;
}
