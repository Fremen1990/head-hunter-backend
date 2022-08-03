import { User } from '../user/entities/user.entity';

export interface createAdminResponse {
   createUserStatus: string;
   createdUser: User;
}
