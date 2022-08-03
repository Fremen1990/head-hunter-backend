import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Hr } from '../hr/entities/hr.entity';

export interface LoginUserResponse {
   id: string;
   email: string;
   role: string;
   token: string;
   active: boolean;
}

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

export interface userProfile {
   id: string;
   email: string;
   role: string;
   currentSessionToken: string | null;
   active: boolean;
   created_at: Date;
   updated_at: Date;
}

export interface getUserProfileResponse {
   userInfo: userProfile;
   userDetails?: User | Student | Hr;
}
