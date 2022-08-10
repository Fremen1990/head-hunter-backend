import { Controller, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Interview } from '../hr/entities/interview.entity';
import { getTodayDateString } from '../utils/date-tools';
import { Student } from '../student/entities/student.entity';
import { StudentStatus } from '../enums/student-status.enum';

@Injectable()
export class CronService {
   @Cron('30 1 * * * ')
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
            // to refactor after mofifyin hr module
            student.studentStatus = StudentStatus.AVAILABLE;
            await student.save();
            await interview.remove();
         }
         console.log(`Deleted ${openInterviews.length} records`);
         return {
            message: `Deleted ${openInterviews.length} records`,
         };
      }

      console.log(`No records removed today`);
      return {
         message: 'No records removed today',
      };
   }
}
