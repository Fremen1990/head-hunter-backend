import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Student } from '../../student/entities/student.entity';
import { HrCandidateAddResponse } from '../../types';
import { User } from '../../user/entities/user.entity';
import { Hr } from '../entities/hr.entity';
import { Brackets, DataSource, Not } from 'typeorm';
import { Interview } from '../entities/interview.entity';
import {
   generateReservationDate,
   getTodayDateString,
} from '../../utils/date-tools';
import { StudentStatus } from '../../enums/student-status.enum';
import { getUserProfileResponse } from '../../types';
import { UserService } from '../../user/services/user.service';
import { StudentService } from '../../student/services/student.service';
import { Role } from 'src/enums/role.enum';

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

   // exlude user to not show them in as available
   async excludeIds(hrUser: User): Promise<string[]> {
      const openInterviews = await this.getInterviews(hrUser);

      let excludedIds = openInterviews.map((student) => student.studentId);

      if (excludedIds.length === 0) {
         excludedIds = [''];
      }

      return excludedIds;
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

   // define DTO and interface;
   async getCandidatesListFiltered(hrUser: User, obj: any): Promise<any> {
      const max = 99999;
      const degreesCategories = [];
      const studentsIds = await this.excludeIds(hrUser); // get excluded ids

      let {
         courseCompletion,
         courseEngagement,
         expectedContractType,
         expectedTypeOfWork,
         projectDegree,
         teamProjectDegree,
      } = obj;

      const { canTakeApprenticeship, expectedSalary, monthsOfCommercialExp } =
         obj;

      // injected
      console.log('canTakeApprenticeship - Injected', canTakeApprenticeship);
      console.log('courseCompletion - Injected', courseCompletion);
      console.log('courseEngagement - Injected', courseEngagement);
      console.log('expectedContractType - Injected', expectedContractType);
      console.log(
         'expectedSalary - Injected - min, max',
         expectedSalary.min,
         expectedSalary.max,
      );
      console.log('expectedTypeOfWork - Injected', expectedTypeOfWork);
      console.log('monthsOfCommercialExp - Injected', monthsOfCommercialExp);
      console.log('projectDegree', projectDegree);
      console.log('teamProjectDegree', teamProjectDegree);

      // validation to fix values
      if (courseCompletion.length === 0) {
         courseCompletion = ['1', '2', '3', '4', '5'];
         degreesCategories.push(`courseCompletion`);
      } else {
         degreesCategories.push(`courseCompletion`);
      }

      if (courseEngagement.length === 0) {
         courseEngagement = ['1', '2', '3', '4', '5'];
         degreesCategories.push(`courseEngagement`);
      } else {
         degreesCategories.push(`courseEngagement`);
      }

      if (expectedContractType.length === 0) {
         expectedContractType = ['any', 'uop', 'b2b', 'uz_uod'];
      }
      if (expectedSalary.max === '') {
         expectedSalary.max = max;
      }
      if (expectedTypeOfWork.length === 0) {
         expectedTypeOfWork = [
            'any',
            'office',
            'remote',
            'hybrid',
            'ready_to_move',
         ];
      }
      if (projectDegree.length === 0) {
         projectDegree = ['1', '2', '3', '4', '5'];
         degreesCategories.push(`projectDegree`);
      } else {
         degreesCategories.push(`projectDegree`);
      }

      if (teamProjectDegree.length === 0) {
         teamProjectDegree = ['1', '2', '3', '4', '5'];
         degreesCategories.push(`teamProjectDegree`);
      } else {
         degreesCategories.push(`teamProjectDegree`);
      }

      // Fixed values
      console.log('studentsIds', studentsIds);
      console.log('degressCategories', degreesCategories);
      console.log('canTakeApprenticeship - Fixed', canTakeApprenticeship);
      console.log('courseCompletion - Fixed', courseCompletion);
      const minGrade0 = Number(courseCompletion[0]);
      const maxGrade0 = Number(courseCompletion[0] + '.99');
      console.log('search', minGrade0, maxGrade0);
      console.log('courseEngagement - Fixed', courseEngagement);
      console.log('expectedContractType - Fixed', expectedContractType);
      console.log(
         'expectedSalary - Fixed - min, max',
         expectedSalary.min,
         expectedSalary.max,
      );
      console.log('expectedTypeOfWork - Fixed', expectedTypeOfWork);
      console.log('monthsOfCommercialExp - Fixed', monthsOfCommercialExp);
      console.log('projectDegree - Fixed', projectDegree);
      console.log('teamProjectDegree - Fixed', teamProjectDegree);

      // QB
      const results = await this.dataSource
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
         .andWhere('student.canTakeApprenticeship = :canTakeApprenticeship', {
            canTakeApprenticeship,
         })
         .andWhere('student.expectedContractType IN (:expectedContractType)', {
            expectedContractType: [...expectedContractType],
         })
         .andWhere('student.monthsOfCommercialExp = :monthsOfCommercialExp', {
            monthsOfCommercialExp,
         })
         .andWhere('student.expectedTypeOfWork IN (:expectedTypeOfWork)', {
            expectedTypeOfWork: [...expectedTypeOfWork],
         })
         .andWhere(
            'student.expectedSalary >= :min AND student.expectedSalary <= :max',
            {
               min: expectedSalary.min,
               max: expectedSalary.max,
            },
         );

      results.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.courseCompletion >= :courseCompletionMin0 AND student.courseCompletion <= :courseCompletionMax0',
               {
                  courseCompletionMin0: Number(courseCompletion[0]),
                  courseCompletionMax0: Number(courseCompletion[0] + '.99'),
               },
            );
            for (let i = 1; i < courseCompletion.length; i++) {
               qb.orWhere(
                  `student.courseCompletion >= :courseCompletionMin${i} AND student.courseCompletion <= :courseCompletionMax${i}`,
                  {
                     [`courseCompletionMin${i}`]: Number(courseCompletion[i]),
                     [`courseCompletionMax${i}`]: Number(
                        courseCompletion[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      results.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.courseEngagement >= :courseEngagementMin0 AND student.courseEngagement <= :courseEngagementMax0',
               {
                  courseEngagementMin0: Number(courseEngagement[0]),
                  courseEngagementMax0: Number(courseEngagement[0] + '.99'),
               },
            );
            for (let i = 1; i < courseEngagement.length; i++) {
               qb.orWhere(
                  `student.courseEngagement >= :courseEngagementMin${i} AND student.courseEngagement <= :courseEngagementMax${i}`,
                  {
                     [`courseEngagementMin${i}`]: Number(courseEngagement[i]),
                     [`courseEngagementMax${i}`]: Number(
                        courseEngagement[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      results.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.projectDegree >= :projectDegreeMin0 AND student.projectDegree <= :projectDegreeMax0',
               {
                  projectDegreeMin0: Number(projectDegree[0]),
                  projectDegreeMax0: Number(projectDegree[0] + '.99'),
               },
            );
            for (let i = 1; i < projectDegree.length; i++) {
               qb.orWhere(
                  `student.projectDegree >= :projectDegreeMin${i} AND student.projectDegree <= :projectDegreeMax${i}`,
                  {
                     [`projectDegreeMin${i}`]: Number(projectDegree[i]),
                     [`projectDegreeMax${i}`]: Number(projectDegree[i] + '.99'),
                  },
               );
            }
         }),
      );

      results.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.teamProjectDegree >= :teamProjectDegreeMin0 AND student.teamProjectDegree <= :teamProjectDegreeMax0',
               {
                  teamProjectDegreeMin0: Number(teamProjectDegree[0]),
                  teamProjectDegreeMax0: Number(teamProjectDegree[0] + '.99'),
               },
            );
            for (let i = 1; i < teamProjectDegree.length; i++) {
               qb.orWhere(
                  `student.teamProjectDegree >= :teamProjectDegreeMin${i} AND student.teamProjectDegree <= :teamProjectDegreeMax${i}`,
                  {
                     [`teamProjectDegreeMin${i}`]: Number(teamProjectDegree[i]),
                     [`teamProjectDegreeMax${i}`]: Number(
                        teamProjectDegree[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      return results.getMany();
   }

   // define DTO and interface;
   async showMyInterviewsFiltered(hrUser: User, obj: any) {
      const max = 99999;

      // znajdz wszystkich studentow, którzy maja ze mna rozmowe
      const openInterviews = await this.getInterviews(hrUser);

      if (openInterviews.length === 0) {
         return openInterviews;
      }

      // pobierz wszystkie id to tablicy, pobierz daty rozmow do tablicy - wszystko jest sortowane wiec bedzie sie zgadzać
      const studentsIds = openInterviews.map((student) => student.studentId);

      let {
         courseCompletion,
         courseEngagement,
         expectedContractType,
         expectedTypeOfWork,
         projectDegree,
         teamProjectDegree,
      } = obj;

      const { canTakeApprenticeship, expectedSalary, monthsOfCommercialExp } =
         obj;

      // validation to fix values
      if (courseCompletion.length === 0) {
         courseCompletion = ['1', '2', '3', '4', '5'];
      }

      if (courseEngagement.length === 0) {
         courseEngagement = ['1', '2', '3', '4', '5'];
      }

      if (expectedContractType.length === 0) {
         expectedContractType = ['any', 'uop', 'b2b', 'uz_uod'];
      }
      if (expectedSalary.max === '') {
         expectedSalary.max = max;
      }
      if (expectedTypeOfWork.length === 0) {
         expectedTypeOfWork = [
            'any',
            'office',
            'remote',
            'hybrid',
            'ready_to_move',
         ];
      }
      if (projectDegree.length === 0) {
         projectDegree = ['1', '2', '3', '4', '5'];
      }

      if (teamProjectDegree.length === 0) {
         teamProjectDegree = ['1', '2', '3', '4', '5'];
      }

      const filter = await this.dataSource
         .getRepository(Student)
         .createQueryBuilder('Student')
         .andWhere('student.studentId IN (:studentId)', {
            studentId: [...studentsIds],
         })
         .andWhere('student.canTakeApprenticeship = :canTakeApprenticeship', {
            canTakeApprenticeship,
         })
         .andWhere('student.expectedContractType IN (:expectedContractType)', {
            expectedContractType: [...expectedContractType],
         })
         .andWhere('student.monthsOfCommercialExp = :monthsOfCommercialExp', {
            monthsOfCommercialExp,
         })
         .andWhere('student.expectedTypeOfWork IN (:expectedTypeOfWork)', {
            expectedTypeOfWork: [...expectedTypeOfWork],
         })
         .andWhere(
            'student.expectedSalary >= :min AND student.expectedSalary <= :max',
            {
               min: expectedSalary.min,
               max: expectedSalary.max,
            },
         );

      filter.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.courseCompletion >= :courseCompletionMin0 AND student.courseCompletion <= :courseCompletionMax0',
               {
                  courseCompletionMin0: Number(courseCompletion[0]),
                  courseCompletionMax0: Number(courseCompletion[0] + '.99'),
               },
            );
            for (let i = 1; i < courseCompletion.length; i++) {
               qb.orWhere(
                  `student.courseCompletion >= :courseCompletionMin${i} AND student.courseCompletion <= :courseCompletionMax${i}`,
                  {
                     [`courseCompletionMin${i}`]: Number(courseCompletion[i]),
                     [`courseCompletionMax${i}`]: Number(
                        courseCompletion[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      console.log(openInterviews.length);
      filter.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.courseEngagement >= :courseEngagementMin0 AND student.courseEngagement <= :courseEngagementMax0',
               {
                  courseEngagementMin0: Number(courseEngagement[0]),
                  courseEngagementMax0: Number(courseEngagement[0] + '.99'),
               },
            );
            for (let i = 1; i < courseEngagement.length; i++) {
               qb.orWhere(
                  `student.courseEngagement >= :courseEngagementMin${i} AND student.courseEngagement <= :courseEngagementMax${i}`,
                  {
                     [`courseEngagementMin${i}`]: Number(courseEngagement[i]),
                     [`courseEngagementMax${i}`]: Number(
                        courseEngagement[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      console.log(openInterviews.length);
      filter.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.projectDegree >= :projectDegreeMin0 AND student.projectDegree <= :projectDegreeMax0',
               {
                  projectDegreeMin0: Number(projectDegree[0]),
                  projectDegreeMax0: Number(projectDegree[0] + '.99'),
               },
            );
            for (let i = 1; i < projectDegree.length; i++) {
               qb.orWhere(
                  `student.projectDegree >= :projectDegreeMin${i} AND student.projectDegree <= :projectDegreeMax${i}`,
                  {
                     [`projectDegreeMin${i}`]: Number(projectDegree[i]),
                     [`projectDegreeMax${i}`]: Number(projectDegree[i] + '.99'),
                  },
               );
            }
         }),
      );

      filter.andWhere(
         new Brackets((qb) => {
            qb.where(
               'student.teamProjectDegree >= :teamProjectDegreeMin0 AND student.teamProjectDegree <= :teamProjectDegreeMax0',
               {
                  teamProjectDegreeMin0: Number(teamProjectDegree[0]),
                  teamProjectDegreeMax0: Number(teamProjectDegree[0] + '.99'),
               },
            );
            for (let i = 1; i < teamProjectDegree.length; i++) {
               qb.orWhere(
                  `student.teamProjectDegree >= :teamProjectDegreeMin${i} AND student.teamProjectDegree <= :teamProjectDegreeMax${i}`,
                  {
                     [`teamProjectDegreeMin${i}`]: Number(teamProjectDegree[i]),
                     [`teamProjectDegreeMax${i}`]: Number(
                        teamProjectDegree[i] + '.99',
                     ),
                  },
               );
            }
         }),
      );

      const myInterviews = (
         await filter.orderBy('student.studentId', 'ASC').getMany()
      ).map((result) => result);

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
   }
}
