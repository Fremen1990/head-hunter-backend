import {
   BaseEntity,
   Column,
   Entity,
   JoinColumn,
   OneToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Hr } from './hr.entity';

@Entity()
export class Interview extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   interviewTitle: string;

   @Column()
   interviewDescription: string;

   @Column()
   interviewDate: string;

   @OneToOne(() => Student, (student) => student.interview)
   @JoinColumn()
   student: Student;

   @OneToOne(() => Hr, (interviewer) => interviewer.hrInterview)
   @JoinColumn()
   interviewer: Hr;
}
