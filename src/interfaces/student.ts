import { Student } from '../student/student.entity';

export interface RegisterStudentResponse {
   id: string;
   registerTokenId: string | null;
   active: boolean;
}
