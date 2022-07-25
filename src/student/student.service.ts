import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Student } from './student.entity';
import {
   DeleteStudentResponse,
   RegisterStudentResponse,
} from '../interfaces/student';
import { hashPwd } from '../utils/hash-pwd';
import { User } from '../user/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class StudentService {
   filter(student: User): RegisterStudentResponse {
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

      const student = await this.getOneUser(userId);

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

   async getOneUser(id: string): Promise<User> {
      return await User.findOneBy({ id });
   }

   async getOneStudent(studentEmail: string): Promise<Student> {
      return await Student.findOneBy({ email: studentEmail });
   }

   async updateStudentDetails(
      studentEmail: string,
      studentDetails: UpdateProfileDto,
   ) {
      const student = await this.getOneStudent(studentEmail);

      if (student) {
         student.studentStatus = studentDetails.studentStatus;
         student.tel = studentDetails.tel;
         student.firstName = studentDetails.firstName;
         student.lastName = studentDetails.lastName;
         student.githubUserName = studentDetails.githubUserName;
         student.portfolioUrls = studentDetails.portfolioUrls;
         student.projectUrls = studentDetails.projectUrls;
         student.bio = studentDetails.bio;
         student.expectedTypeOfWork = studentDetails.expectedTypeOfWork;
         student.targetWorkCity = studentDetails.targetWorkCity;
         student.expectedContractType = studentDetails.expectedContractType;
         student.expectedSalary = studentDetails.expectedSalary;
         student.canTakeApprenticeship = studentDetails.canTakeApprenticeship;
         student.monthsOfCommercialExp = studentDetails.monthsOfCommercialExp;
         student.education = studentDetails.education;
         student.workExperience = studentDetails.workExperience;
         student.courses = studentDetails.courses;
         await student.save();
      }

      if (!student) {
         return { UpdateStudentStatus: 'Student not found' };
      }

      return { UpdateStudentStatus: 'Student details updated' };
   }

   async deleteStudent(studentEmail: string): Promise<DeleteStudentResponse> {
      const student = await this.getOneStudent(studentEmail);
      if (!student) {
         return { DeleteStudentStatus: 'Student not found' };
      }
      await student.remove();

      return { DeleteStudentStatus: 'Student deleted' };
   }
}
