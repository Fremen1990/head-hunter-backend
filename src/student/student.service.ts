import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Student } from './student.entity';
import { RegisterStudentResponse } from '../interfaces/student';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class StudentService {
   filter(student: Student): RegisterStudentResponse {
      const { id, registerTokenId, active } = student;
      return { id, registerTokenId, active };
   }

   async register(
      userPwd: RegisterDto,
      userId: string,
      registerTokenId: string,
   ): Promise<RegisterStudentResponse> {
      // nie wiem jak w insomnii wyrzucic dane z params i body jednoczesnie, ponizej obiekt data do sprawdzenia funcjonalnosci
      const data = {
         pwd: '1234',
      };

      const student = await this.getOneStudent(userId);

      if (student.registerTokenId === registerTokenId) {
         student.registerTokenId = null;
      } else {
         throw new Error('This student is already registered');
      }
      student.pwdHash = hashPwd(data.pwd);
      student.active = true;

      await student.save();

      return this.filter(student);
   }

   async getOneStudent(id: string): Promise<Student> {
      return await Student.findOneBy({ id });
   }

   async getAllStudents(): Promise<Student[]> {
      return await Student.find();
   }
}
