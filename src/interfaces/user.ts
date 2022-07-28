import { User } from '../user/entities/user.entity';

export interface RegisterUserResponse {
   id: string;
   registrationToken: string | null;
   active: boolean;
}

export interface ImportUserResponse {
   importSuccess: string;
   createdUsers?: string[];
   newUsersCounter?: number;
   duplicatedUsers?: string[];
   duplicatedUsersCounter?: number;
   message?: string;
}

export interface createOneUserResponse {
   createUserStatus: string;
   createdUser: User;
}
