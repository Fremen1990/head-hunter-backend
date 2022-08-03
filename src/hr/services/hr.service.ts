import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Student } from '../../student/entities/student.entity';
import {
   HrCandidateAddResponse,
   HrCandidateListResponse,
   HrCandidateRemoveResponse,
} from '../../interfaces/hr';
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

@Injectable()
export class HrService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   // Nowe
   async getCandidatesList(): Promise<any> {
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

   // use only to getData on frontend
   async getOneHr(hrId): Promise<any> {
      //dodaj walidajce roli
      const user = await User.findOneBy({ id: hrId });
      if (!user) {
         throw new HttpException('Hr not found', HttpStatus.NOT_FOUND);
      }

      const hr = await this.dataSource
         .getRepository(User)
         .createQueryBuilder('user')
         .leftJoinAndSelect('user.hr', 'hr')
         .where('hr.hrId = :hrId', {
            hrId: `${hrId}`,
         })
         .getOne();

      return hr;
   }

   async getOneCandidate(studentId): Promise<any> {
      const user = await User.findOneBy({ id: studentId });
      if (!user) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

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

   async addOneCandidateToList(user: User, studentId: string): Promise<any> {
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
         interviewingHr,
         candidate,
         interview: `Interview between ${newInterview.interviewTitle} and ${interviewingHr.fullName} has been set`,
         interviewId: newInterview.interviewId,
      };
   }

   async;

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
