import {
   BaseEntity,
   Column,
   Entity,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Hr } from './hr.entity';
import { Student } from '../../student/entities/student.entity';

// student trafia na liste to zmienia status na do rozmowy, hr ma 10 dni jak nie to wraca spowrotem na dostępny
// @Entity('candidates-to-interview')
// export class Candidates extends BaseEntity {
//    @PrimaryGeneratedColumn('uuid')
//    interviewId: string;
//
//    @ManyToOne(() => Hr, (hr) => hr.interview)
//    hr: Hr;
//
//    @ManyToOne(() => Student, (student) => student.interview)
//    student: Student;
// }
@Entity('interview')
export class Interview extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   interviewId: string;

   @Column()
   interviewTitle: string;

   @Column()
   description: string;

   @Column({ type: 'date' })
   date: string;

   @Column({ length: 36 })
   studentId: string;

   @ManyToOne(() => Hr, (hr) => hr.interview)
   hr: Hr;
}
