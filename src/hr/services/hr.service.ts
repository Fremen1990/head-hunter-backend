import { Injectable } from '@nestjs/common';
import { Hr } from '../entities/hr.entity';
import { Student } from '../../student/entities/student.entity';

@Injectable()
export class HrService {
   async getHr(): Promise<Hr[]> {
      return Hr.find();
   }

   getCandidatesList(): Promise<any> {
      // return User.find({ relations: ['student'] });
      return Student.find({ relations: ['user'] });

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
}
