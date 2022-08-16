import {
   HttpException,
   HttpStatus,
   Body,
   Delete,
   Get,
   Inject,
   Injectable,
   Param,
   Put,
} from '@nestjs/common';

import { Student } from '../entities/student.entity';
import {
   DeleteStudentResponse,
   UpdateStudentStatus,
} from '../../types/student';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../enums/role.enum';
import { StudentStatus } from '../../enums/student-status.enum';
import { Interview } from '../../hr/entities/interview.entity';

// do napisania interfejsy do zwrotu
@Injectable()
export class StudentService {
   constructor(@Inject(UserService) private userService: UserService) {}

   async getOneStudent(id: string): Promise<Student | any> {
      const student = await User.findOne({
         where: {
            id,
            role: Role.STUDENT,
         },
         relations: ['student'],
      });

      if (!student) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return student;
   }

   async getAllStudents(): Promise<any> {
      const students = await User.find({
         where: {
            role: Role.STUDENT,
         },
         relations: ['student'],
      });

      return students;
   }

   async updateStudentDetails(id: string, studentDetails: UpdateProfileDto) {
      const student = await Student.findOneBy({ studentId: id });

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
         student.expectedSalary = Number(studentDetails.expectedSalary);
         student.canTakeApprenticeship = studentDetails.canTakeApprenticeship;
         student.monthsOfCommercialExp = Number(
            studentDetails.monthsOfCommercialExp,
         );
         student.education = studentDetails.education;
         student.workExperience = studentDetails.workExperience;
         student.courses = studentDetails.courses;
         student.firstLogin = false;
         await student.save();
      }

      if (!student) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return { UpdateStudentStatus: 'Student details updated' };
   }

   async deleteStudent(id: string): Promise<DeleteStudentResponse> {
      const student = await this.getOneStudent(id);
      if (!student) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      await student.remove();

      return { DeleteStudentStatus: 'Student deleted' };
   }

   async updateStatus(user: User): Promise<UpdateStudentStatus> {
      const student = await Student.findOneByOrFail({ studentId: user.id });
      const openInterviews = await Interview.find({
         where: {
            studentId: student.studentId,
         },
      });
      let studentStatus = '';

      if (
         student.studentStatus === StudentStatus.AVAILABLE ||
         student.studentStatus === StudentStatus.INTERVIEW
      ) {
         if (openInterviews) {
            for (const interview of openInterviews) {
               await interview.remove();
            }
         }
         student.studentStatus = StudentStatus.EMPLOYED;
         studentStatus = StudentStatus.EMPLOYED;
         await student.save();
      } else {
         student.studentStatus = StudentStatus.AVAILABLE;
         studentStatus = StudentStatus.AVAILABLE;
         await student.save();
      }
      return { studentStatus };
   }
}
