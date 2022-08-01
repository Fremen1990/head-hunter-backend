import { User } from '../user/entities/user.entity';

export interface UpdateStudentResponse {
   UpdateStudentStatus: string;
}

export interface DeleteStudentResponse {
   DeleteStudentStatus: string;
}

export interface ImportRandomStudentsResponse {
   createdUsersList: string[];
}
