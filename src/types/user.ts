import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Hr } from '../hr/entities/hr.entity';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';

export interface LoginUser {
   email: string;
   pwd: string;
}

export interface LoginUserResponse {
   id: string;
   email: string;
   role: string;
   token: string;
   active: boolean;
}

export interface LogoutUserResponse {
   ok?: string;
   error?: string;
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

export interface UserProfile {
   id: string;
   email: string;
   role: string;
   currentSessionToken: string | null;
   active: boolean;
   encryptedPwd?: string;
   registrationToken?: string;
   resetPasswordToken?: string;
   created_at: Date;
   updated_at: Date;
}

export interface getUserProfileResponse {
   id: string;
   email: string;
   encryptedPwd;
   role: string;
   currentSessionToken: string | null;
   registrationToken: string;
   resetPasswordToken: string;
   active: boolean;
   created_at: Date;
   updated_at: Date;

   student?: Student;
   hr?: Hr;
}

export type UserType = typeof User;

export type ResetPwdType = typeof ResetPasswordDto;
