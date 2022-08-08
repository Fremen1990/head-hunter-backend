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
import { DeleteStudentResponse } from '../../types/student';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserService } from 'src/user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../enums/role.enum';

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

   // JSON
   // {
   //    "studentStatus": "available",
   //    "tel": "666-666-666",
   //    "firstName": "tOMASZEK",
   //    "lastName": "wer",
   //    "githubUserName": "wer",
   //    "portfolioUrls": ["raz", "dwa"],
   //    "projectUrls": ["trzy", "cztery"],
   //    "bio": "My bio is aweeeesomeeeeeeeeee",
   //    "expectedTypeOfWork": "any",
   //    "targetWorkCity": "we",
   //    "expectedContractType": "any",
   //    "expectedSalary": "123",
   //    "canTakeApprenticeship": "no",
   //    "monthsOfCommercialExp": 10,
   //    "education": "asd",
   //    "workExperience": "asd",
   //    "courses": "sad"
   // }

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
         student.expectedSalary = studentDetails.expectedSalary;
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
}
