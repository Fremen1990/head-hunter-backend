import { Injectable } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { DeleteStudentResponse } from '../../interfaces/student';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { validateStudentStatus } from '../../enums/student-status.enum';
import { validateWorkType } from '../../enums/work-type.enum';
import { validateContractType } from '../../enums/contract-type.enum';
import { validateApprenticeship } from '../../enums/apprenticeship.enum';

@Injectable()
export class StudentService {
   async getOneStudent(id: string): Promise<Student> {
      return await Student.findOneBy({ id });
   }

   async updateStudentDetails(id: string, studentDetails: UpdateProfileDto) {
      const student = await this.getOneStudent(id);

      if (student) {
         student.studentStatus = validateStudentStatus(
            studentDetails.studentStatus,
         );
         student.tel = studentDetails.tel;
         student.firstName = studentDetails.firstName;
         student.lastName = studentDetails.lastName;
         student.githubUserName = studentDetails.githubUserName;
         student.portfolioUrls = studentDetails.portfolioUrls;
         student.projectUrls = studentDetails.projectUrls;
         student.bio = studentDetails.bio;
         student.expectedTypeOfWork = validateWorkType(
            studentDetails.expectedTypeOfWork,
         );
         student.targetWorkCity = studentDetails.targetWorkCity;
         student.expectedContractType = validateContractType(
            studentDetails.expectedContractType,
         );
         student.expectedSalary = studentDetails.expectedSalary;
         student.canTakeApprenticeship = validateApprenticeship(
            studentDetails.canTakeApprenticeship,
         );
         student.monthsOfCommercialExp = studentDetails.monthsOfCommercialExp;
         student.education = studentDetails.education;
         student.workExperience = Number(studentDetails.workExperience);
         student.courses = studentDetails.courses;
         await student.save();
      }

      if (!student) {
         return { UpdateStudentStatus: 'Student not found' };
      }

      return { UpdateStudentStatus: 'Student details updated' };
   }

   async deleteStudent(id: string): Promise<DeleteStudentResponse> {
      const student = await this.getOneStudent(id);
      if (!student) {
         return { DeleteStudentStatus: 'Student not found' };
      }
      await student.remove();

      return { DeleteStudentStatus: 'Student deleted' };
   }
}
