import { Student } from 'src/student/student.entity';
import {
   BaseEntity,
   Column,
   Entity,
   PrimaryGeneratedColumn,
   OneToMany,
} from 'typeorm';
import { HrResponse } from '../interfaces/hr';

@Entity()
export class HrEntity extends BaseEntity implements HrResponse {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      length: 100,
   })
   email: string;

   @Column({
      length: 60,
   })
   fullName: string;

   @Column({
      length: 20,
   })
   company: string;

   @Column({
      type: 'tinyint',
   })
   maxReservedStudents: number;

   @Column({
      type: 'tinyint',
      default: 0,
   })
   countOfAddedStudents: number;

   @Column({
      default: false,
   })
   active: boolean;
   @OneToMany((type) => Student, (entity) => entity.hrInterestedIn)
   studentsAdded: Student[];
}
