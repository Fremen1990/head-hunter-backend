import { Controller, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Interview } from '../hr/entities/interview.entity';
import { getTodayDateString } from '../utils/date-tools';
import { Student } from '../student/entities/student.entity';
import { StudentStatus } from '../enums/student-status.enum';
import { HrService } from '../hr/services/hr.service';
import { StudentService } from '../student/services/student.service';

@Injectable()
export class CronService {
   constructor(@Inject(HrService) private hrService: HrService) {}

   // @Cron('* * * * *') //every minute
   @Cron('30 1 * * *') // “At 01:30.”
   async removeStudentsFromInterview(): Promise<void> {
      const today = getTodayDateString();

      const openInterviews = await Interview.find({
         where: {
            date: today,
         },
      });

      // console.log(openInterviews);

      if (openInterviews.length > 0) {
         for (const interview of openInterviews) {
            const student = await Student.findOneBy({
               studentId: interview.studentId,
            });

            // console.log(student);
            await interview.remove();

            if (
               (await this.hrService.getStudentInterviewsCount(
                  student.studentId,
               )) === 0
            ) {
               student.studentStatus = StudentStatus.AVAILABLE;
               await student.save();
            }
         }
         console.log(`Deleted ${openInterviews.length} records`);
         // return {
         //    message: `Deleted ${openInterviews.length} records`,
         // };
      }

      console.log(`No records removed today`);
      // return {
      //    message: 'No records removed today',
      // };
   }
}
