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
import {
   generateReservationDate,
   getTodayDateString,
} from '../../utils/date-tools';
import { encrypt } from '../../utils/pwd-tools';
import nanoToken from '../../utils/nano-token';
import { Role } from '../../enums/role.enum';
import { StudentStatus } from '../../enums/student-status.enum';
import { type } from 'os';
import { isInstance } from 'class-validator';
import { getUserProfileResponse } from '../../types';
import { UserService } from '../../user/services/user.service';
import { StudentService } from '../../student/services/student.service';

@Injectable()
export class HrService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      @Inject(UserService) private userService: UserService,
      @Inject(StudentService) private studentService: StudentService,
   ) {}

   // when student is hired, remove him/her from other interviews
   async cleanUpAfterHiring(studentId: string): Promise<void> {
      const count = await this.getStudentInterviewsCount(studentId);
      // console.log('Count', count);
      if (count > 0) {
         const studentsInterviews = await Interview.find({
            where: {
               studentId,
            },
         });
         // console.log('studentsInterviews', studentsInterviews);
         for (const interview of studentsInterviews) {
            await interview.remove();
            // tutaj mozna dołozyć maila do wszystkich HRów z informacją
         }
         console.log('All remaining interviews have been canceled');
      }
   }

   async getStudentInterviewsCount(studentId: string): Promise<number> {
      return (
         await Interview.find({
            where: {
               studentId,
            },
         })
      ).length;
   }

   // prevent HR for adding student to inteview twice
   async doubleInterviewCheck(hrUser: User, studentId): Promise<boolean> {
      return (await this.getInterviews(hrUser)).some(
         (interview) => interview.studentId === studentId,
      );
   }

   // get maximum reservation for HR
   async getMaxReservedStudents(hrId: string): Promise<number> {
      const { maxReservedStudents } = await Hr.findOneBy({ hrId });
      return maxReservedStudents;
   }

   async getInterviews(hrUser: User): Promise<any> {
      return await Interview.find({
         where: {
            hrId: hrUser.id,
         },
         order: {
            studentId: 'ASC',
         },
      });
   }

   // get a list of students that can be added to interview - status (interview || available) &&  active
   // in return object user with relations to student table, so all student data
   async getCandidatesList(hrUser: User): Promise<getUserProfileResponse[]> {
      // do osobnej metody bo sie powtarza 3 razy
      const openInterviews = await this.getInterviews(hrUser);

      let studentsIds = openInterviews.map((student) => student.studentId);

      if (studentsIds.length === 0) {
         studentsIds = [''];
      }

      return await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.student', 'student')
         .where('student.studentStatus IN (:studentStatus)', {
            studentStatus: ['available', 'interview'],
         })
         .andWhere('user.active = :active', { active: true })
         .andWhere('student.studentId NOT IN (:studentId)', {
            studentId: [...studentsIds],
         })
         .getMany();
   }

   // get a student that can be added to interview - status available && active
   // in return object user with relations to student table, so all student data
   // todo interface for promise when front end accepts this return
   async getOneCandidate(studentId): Promise<any> {
      await this.userService.getOneUser(studentId);

      const newCandidate = await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.student', 'student')
         .where('student.studentId = :studentId', {
            studentId: `${studentId}`,
         })
         .andWhere('student.studentStatus IN (:studentStatus)', {
            studentStatus: ['available', 'interview'],
         })
         .andWhere('user.active = :active', { active: true })
         .getOne();

      if (!newCandidate) {
         throw new HttpException(
            'Student is not active yet or has been employed.',
            HttpStatus.NOT_FOUND,
         );
      }

      return newCandidate;
   }

   // get one HR user data
   // in return object user with relations to hr table, so all hr data including open interviews
   // use only to getData on frontend
   // todo interface for promise when front end accepts this return
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

      const openInterviews = await this.getInterviews(hr);

      // test return of openInterviews
      return {
         hr,
         openInterviews:
            openInterviews ??
            `This HR doesn't have any interviews with students now`,
      };
   }

   // add student to interview with reservation on next 10 days, change student status on inverview,
   async addOneCandidateToList(
      user: User,
      studentId: string,
   ): Promise<HrCandidateAddResponse> {
      // console.log('STUDENT ID', studentId);
      const interviewingHr = await Hr.findOneBy({ hrId: user.id });
      const candidate = await this.getOneCandidate(studentId);
      const { firstName, lastName } = candidate.student;

      const interviews = (await Interview.findBy({ hrId: user.id })).map(
         (interview) => interview,
      );

      if (interviews.length >= (await this.getMaxReservedStudents(user.id))) {
         throw new HttpException(
            'This HR reached the maximum number of students that can be interviewed at once',
            HttpStatus.CONFLICT,
         );
      }

      if (await this.doubleInterviewCheck(user, candidate.id)) {
         throw new HttpException(
            `Wake up, you are already interviewing ${firstName} ${lastName}`,
            HttpStatus.CONFLICT,
         );
      }

      const newInterview = new Interview();
      newInterview.interviewId = uuid();
      newInterview.interviewTitle = `${firstName} ${lastName}`;
      newInterview.date = generateReservationDate();
      newInterview.studentId = candidate.id;

      newInterview.hrId = interviewingHr.hrId;

      await newInterview.save();

      if (candidate.student.studentStatus === 'available') {
         console.log('zmiana statusu');
         candidate.student.studentStatus = StudentStatus.INTERVIEW;

         await candidate.student.save();
      }

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
   // todo interface for promise when front end accepts this return
   async showMyInterviews(hrUser: User): Promise<any> {
      // znajdz wszystkich studentow, którzy maja ze mna rozmowe
      const openInterviews = await this.getInterviews(hrUser);

      if (openInterviews.length === 0) {
         return openInterviews;
      }

      // pobierz wszystkie id to tablicy, pobierz daty rozmow do tablicy - wszystko jest sortowane wiec bedzie sie zgadzać
      const studentsIds = openInterviews.map((student) => student.studentId);

      const myInterviews = await this.dataSource
         .createQueryBuilder(Student, 'student')
         .where('student.studentId IN (:studentsIds)', {
            studentsIds: [...studentsIds],
         })
         .orderBy('student.studentId', 'ASC')
         .getMany();

      const data = [];
      for (let i = 0; i < myInterviews.length; i++) {
         data.push({
            ...openInterviews[i],
            student: {
               ...myInterviews[i],
            },
         });
      }

      return data;

      // ---------- to be deleted if Maciek accepts new object -----------

      //const interviewTill = openInterviews.map((student) => student.date);

      // const myOpenInteviews = await this.dataSource
      //    .createQueryBuilder(Interview, 'interview')
      //    .where('interview.studentId IN (:studentsIds)', {
      //       studentsIds: [...studentsIds],
      //    })
      //    .orderBy('interview.studentId', 'ASC')
      //    .getMany();

      // return myOpenInteviews;

      // pobierz wszystkich studentow z po id z tablicy
      // const myInterviews = (
      //    await this.dataSource
      //       .createQueryBuilder(Student, 'student')
      //       .where('student.studentId IN (:studentsIds)', {
      //          studentsIds: [...studentsIds],
      //       })
      //       .orderBy('student.studentId', 'ASC')
      //       .getMany()
      // ).map((student) => {
      //    return {
      //       id: student.studentId,
      //       githubUserName: student.githubUserName, // for user image purpose
      //       firstName: student.firstName,
      //       lastName: student.lastName,
      //       courseCompletion: student.courseCompletion,
      //       courseEngagement: student.courseEngagement,
      //       projectDegree: student.projectDegree,
      //       teamProjectDegree: student.teamProjectDegree,
      //       expectedTypeOfWork: student.expectedTypeOfWork,
      //       targetWorkCity: student.targetWorkCity,
      //       expectedContractType: student.expectedContractType,
      //       expectedSalary: student.expectedSalary,
      //       canTakeApprenticeship: student.canTakeApprenticeship,
      //       monthsOfCommercialExp: student.monthsOfCommercialExp,
      //    };
      // });

      // const data = [];
      // for (let i = 0; i < myInterviews.length; i++) {
      //    data.push({
      //       availableTill: interviewTill[i],
      //       ...myInterviews[i],
      //    });
      // }
      //
      // return data;
   }

   // todo interface for promise when front end accepts this return
   async remove(hrUser: User, studentId: string): Promise<any> {
      const student = await Student.findOneBy({ studentId });

      if (!student) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const interview = await Interview.findOneBy({
         studentId: studentId,
         hrId: hrUser.id,
      });

      if (!interview) {
         throw new HttpException(
            'This students in not on interview list',
            HttpStatus.NOT_FOUND,
         );
      }

      await interview.remove();

      if ((await this.getStudentInterviewsCount(studentId)) === 0) {
         student.studentStatus = StudentStatus.AVAILABLE;
         await student.save();
      }

      return {
         message: `Interview with ${student.firstName} ${student.lastName} was canceled`,
      };
   }

   // todo interface for promise when front end accepts this return
   async hire(hrUser: User, studentId: string): Promise<any> {
      const student = await Student.findOneBy({ studentId });

      if (!student) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const interview = await Interview.findOneBy({
         studentId: studentId,
         hrId: hrUser.id,
      });

      if (!interview) {
         throw new HttpException(
            'This students in not on interview list',
            HttpStatus.NOT_FOUND,
         );
      }

      await interview.remove();

      await this.cleanUpAfterHiring(studentId);

      student.studentStatus = StudentStatus.EMPLOYED;
      await student.save();

      return {
         message: `${student.firstName} ${student.lastName} was hired`,
      };
   }

   //only for test purposes, moved to cron service
   async removeStudentsFromInterview(): Promise<any> {
      const today = getTodayDateString();

      const openInterviews = await Interview.find({
         where: {
            date: today,
         },
      });

      if (openInterviews.length > 0) {
         for (const interview of openInterviews) {
            const student = await Student.findOneBy({
               studentId: interview.studentId,
            });

            student.studentStatus = StudentStatus.AVAILABLE;
            await student.save();
            await interview.remove();
         }
         return {
            message: `Deleted ${openInterviews.length} records`,
         };
      }

      return {
         message: 'No records removed today',
      };
   }
}
