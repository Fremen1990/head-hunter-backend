import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Student } from '../../student/entities/student.entity';
import {
   HrCandidateAddResponse,
   HrCandidateListResponse,
   HrCandidateRemoveResponse,
} from '../../interfaces/hr';
import { User } from '../../user/entities/user.entity';
import { Hr } from '../entities/hr.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class HrService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   // async getCandidatesList(
   //    excludedIds,
   // ): Promise<HrCandidateListResponse[] | Student[]> {
   //    /*
   //
   //     Radek -> dodałem or Student[] aby nie krzyczał
   //     */
   //
   //    // const candidates = User.find({ relations: ['student'] });
   //    const candidates = await Student.find({
   //       relations: ['user'],
   //    });
   //    // TO DO QUERY BUILDER WHERE FIND CANDIDATES WITHOUT IDS FROM BODY
   //    return candidates;
   //
   //    //    return User.createQueryBuilder('user')
   //    //       .leftJoinAndSelect('user.student', 'student')
   //    //       .leftJoinAndSelect('user.hr', 'hr')
   //    //       .where('user.id NOT IN hr.candidates')
   //    //       .getMany();
   //    // }
   //
   //    // return User.createQueryBuilder('user')
   //    //    .leftJoinAndSelect('user.student', 'student')
   //    //    .leftJoinAndSelect('user.hr', 'hr')
   //    //    .getMany();
   // }

   // async getOneCandidate(
   //    studentId,
   // ): Promise<HrCandidateListResponse | Student> {
   //    /*
   //
   //     Radek -> dodałem or Student aby nie krzyczał
   //
   //     */
   //    const candidate = await Student.findOneBy({ studentId: studentId });
   //
   //    if (!candidate) {
   //       throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
   //    }
   //    return candidate;
   // }

   async addOneCandidateToList(
      // TODO TO BE COMPLETED LATER WHEN RELATIONS BETWEEN STUDENTS VS INTERVIEW VS HR IS SET UP
      hrUser: User,
      studentId: string,
   ): Promise<HrCandidateAddResponse> {
      // console.log('stuendtID: ', studentId);
      // console.log('user HR', hrUser);

      const candidate = await Student.findOneBy({ studentId: studentId });
      const hr = await Hr.findOneBy({ hrId: hrUser.id });
      // console.log('HR USER', hr);

      console.log(candidate.studentId);

      if (!candidate) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // const newInterview = new Interview();
      // // @ts-ignore
      // newInterview.student = candidate.email;
      // // @ts-ignore
      // newInterview.interviewer = hrUser.email;
      //
      // await newInterview.save();

      // const newInterview = await Interview.create({
      //    studentId: candidate.id,
      //    interviewerId: hrUser.id,
      // });

      return {
         id: candidate.studentId,
         // email: candidate.email,
         firstName: candidate.firstName,
         lastName: candidate.lastName,
         portfolioUrls: candidate.portfolioUrls,
      };
   }

   async removeFromList(
      // TODO TO BE COMPLETED LATER WHEN RELATIONS BETWEEN STUDENTS VS INTERVIEW VS HR IS SET UP
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
}
