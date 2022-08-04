import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Student } from '../../student/entities/student.entity';
import {
   HrCandidateAddResponse,
   HrCandidateListResponse,
   HrCandidateRemoveResponse,
} from '../../types/hr';
import { User } from '../../user/entities/user.entity';
import { Hr } from '../entities/hr.entity';
import { DataSource } from 'typeorm';
import { Interview } from '../entities/interview.entity';
import { generateReservationDate } from '../../utils/reservation-date';
import { encrypt } from '../../utils/pwd-tools';
import nanoToken from '../../utils/nano-token';
import { Role } from '../../enums/role.enum';
import { StudentStatus } from '../../enums/student-status.enum';
import { type } from 'os';
import { isInstance } from 'class-validator';
import { getUserProfileResponse } from '../../types';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class HrService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      @Inject(UserService) private userService: UserService,
   ) {}

   // get a list of students that can be added to interview - status available && active
   // in return object user with relations to student table, so all student data
   async getCandidatesList(): Promise<getUserProfileResponse[]> {
      return await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.student', 'student')
         .where('student.studentStatus = :studentStatus', {
            studentStatus: 'available',
         })
         .andWhere('user.active = :active', { active: true })
         .getMany();
   }

   // get a student that can be added to interview - status available && active
   // in return object user with relations to student table, so all student data
   async getOneCandidate(studentId): Promise<any> {
      await this.userService.getOneUser(studentId);

      const newCandidate = await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.student', 'student')
         .where('student.studentId = :studentId', {
            studentId: `${studentId}`,
         })
         .andWhere('student.studentStatus = :studentStatus', {
            studentStatus: 'available',
         })
         .andWhere('user.active = :active', { active: true })
         .getOne();

      if (!newCandidate) {
         throw new HttpException(
            'Student is not active yet, other possibilities are that is being currently interviewed or employed',
            HttpStatus.NOT_FOUND,
         );
      }
      return newCandidate;
   }

   // get one HR user data
   // in return object user with relations to hr table, so all hr data including open interviews
   // use only to getData on frontend
   async getOneHr(hrId): Promise<any> {
      await this.userService.getOneUser(hrId);

      const hr = await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.hr', 'hr')
         .where('hr.hrId = :hrId', {
            hrId: `${hrId}`,
         })
         .getOne();

      if (!hr) {
         throw new HttpException(
            'This user has different role than HR',
            HttpStatus.NOT_FOUND,
         );
      }

      // przeniesc do osobnej metody
      const openInterviews = await Interview.find({
         where: {
            hrId: hr.id,
         },
      });

      // test return of openInterviews
      return {
         hr,
         openInterviews:
            openInterviews ??
            `This HR doesn't have any interviews with students now`,
      };
   }

   // add student to interview with reservation on next 10 days, change student status on inverview,
   // then is not visible/available for other hr users
   async addOneCandidateToList(
      user: User,
      studentId: string,
   ): Promise<HrCandidateAddResponse> {
      console.log('STUDENT ID', studentId);
      const interviewingHr = await Hr.findOneBy({ hrId: user.id });
      const candidate = await this.getOneCandidate(studentId);
      const { firstName, lastName } = candidate.student;

      const interviews = (await Interview.findBy({ hrId: user.id })).map(
         (interview) => interview,
      );
      console.log(interviews);

      const newInterview = new Interview();
      newInterview.interviewId = uuid();
      newInterview.interviewTitle = `${firstName} ${lastName}`;
      newInterview.date = generateReservationDate();
      newInterview.studentId = candidate.id;

      newInterview.hrId = interviewingHr.hrId;

      await newInterview.save();

      candidate.student.studentStatus = StudentStatus.INTERVIEW;

      await candidate.student.save();

      interviewingHr.interview = [...interviews, newInterview];

      await interviewingHr.save();

      return {
         // interviewingHr,
         // candidate,
         interview: `Interview between ${newInterview.interviewTitle} and ${interviewingHr.fullName} has been set`,
         interviewId: newInterview.interviewId,
      };
   }

   // show students that are being currently invterviewed by hr
   // return needed data for view 'do rozmowy'
   //iterfejs do napisania
   async showMyInterviews(hrUser: User): Promise<any> {
      // znajdz wszystkich studentow, którzy maja ze mna rozmowe
      const openInterviews = await Interview.find({
         where: {
            hrId: hrUser.id,
         },
         order: {
            studentId: 'ASC',
         },
      });

      // pobierz wszystkie id to tablicy, pobierz daty rozmow do tablicy - wszystko jest sortowane wiec bedzie sie zgadzać
      const studentsIds = openInterviews.map((student) => student.studentId);
      const interviewTill = openInterviews.map((student) => student.date);

      // pobierz wszystkich studentow z po id z tablicy
      const myInterviews = (
         await this.dataSource
            .createQueryBuilder(Student, 'student')
            .where('student.studentId IN (:studentsIds)', {
               studentsIds: [...studentsIds],
            })
            .orderBy('student.studentId', 'ASC')
            .getMany()
      ).map((student) => {
         return {
            id: student.studentId,
            githubUserName: student.githubUserName, // for user image purpose
            firstName: student.firstName,
            lastName: student.lastName,
            courseCompletion: student.courseCompletion,
            courseEngagement: student.courseEngagement,
            projectDegree: student.projectDegree,
            teamProjectDegree: student.teamProjectDegree,
            bonusProjectUrls: student.bonusProjectUrls,
            expectedTypeOfWork: student.expectedTypeOfWork,
            targetWorkCity: student.targetWorkCity,
            expectedContractType: student.expectedContractType,
            expectedSalary: student.expectedSalary,
            canTakeApprenticeship: student.canTakeApprenticeship,
            monthsOfCommercialExp: student.monthsOfCommercialExp,
         };
      });

      const data = [];
      for (let i = 0; i < myInterviews.length; i++) {
         data.push({
            availableTill: interviewTill[i],
            ...myInterviews[i],
         });
      }

      return {
         data,
         //openInterviews, // just to compare, comment line
      };
   }

   // TODO TO BE COMPLETED LATER WHEN RELATIONS BETWEEN STUDENTS VS INTERVIEW VS HR IS SET UP
   async removeFromList(
      hrUser: User,
      studentId: string,
   ): Promise<HrCandidateRemoveResponse> {
      const candidate = await Student.findOneBy({ studentId: studentId });

      if (!candidate) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return {
         id: candidate.studentId,
         // email: candidate.email,
         firstName: candidate.firstName,
         lastName: candidate.lastName,
      };
   }
}

//  async getCandidatesList(): // excludedIds,
//  Promise<HrCandidateListResponse[] | Student[]> {
/*

Radek -> dodałem or Student[] aby nie krzyczał
*/

// const candidates = User.find({ relations: ['student'] });
//    const candidates = await Student.find({
//     relations: ['user'],
//   });
// TODO QUERY BUILDER WHERE FIND CANDIDATES WITHOUT IDS FROM BODY
//  return candidates;

//    return User.createQueryBuilder('user')
//       .leftJoinAndSelect('user.student', 'student')
//       .leftJoinAndSelect('user.hr', 'hr')
//       .where('user.id NOT IN hr.candidates')
//       .getMany();
// }

// return User.createQueryBuilder('user')
//    .leftJoinAndSelect('user.student', 'student')
//    .leftJoinAndSelect('user.hr', 'hr')
//    .getMany();
//  }
