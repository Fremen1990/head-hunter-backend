import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Student } from '../../student/entities/student.entity';
import {
   HrCandidateAddResponse,
   HrCandidateListResponse,
   HrCandidateRemoveResponse,
} from '../../interfaces/hr';
import { User } from '../../user/entities/user.entity';
import { Hr } from '../entities/hr.entity';

@Injectable()
export class HrService {
   async getCandidatesList(excludedIds): Promise<HrCandidateListResponse[]> {
      // const candidates = User.find({ relations: ['student'] });
      const candidates = await Student.find({
         relations: ['user'],
      });
      // TODO QUERY BUILDER WHERE FIND CANDIDATES WITHOUT IDS FROM BODY
      return candidates;

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
   }

   async getOneCandidate(studentId): Promise<HrCandidateListResponse> {
      const candidate = await Student.findOneBy({ id: studentId });

      if (!candidate) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return candidate;
   }

   async addOneCandidateToList(
      // TODO TO BE COMPLETED LATER WHEN RELATIONS BETWEEN STUDENTS VS INTERVIEW VS HR IS SET UP
      hrUser: User,
      studentId: string,
   ): Promise<HrCandidateAddResponse> {
      // console.log('stuendtID: ', studentId);
      // console.log('user HR', hrUser);

      const candidate = await Student.findOneBy({ id: studentId });
      const hr = await Hr.findOneBy({ id: hrUser.id });
      // console.log('HR USER', hr);

      console.log(candidate.id);

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
         id: candidate.id,
         email: candidate.email,
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
      const candidate = await Student.findOneBy({ id: studentId });

      if (!candidate) {
         throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return {
         id: candidate.id,
         email: candidate.email,
         firstName: candidate.firstName,
         lastName: candidate.lastName,
      };
   }
}
