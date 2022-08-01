import {
   BaseEntity,
   Column,
   Entity,
   OneToMany,
   OneToOne,
   PrimaryColumn,
   PrimaryGeneratedColumn,
} from 'typeorm';
// import { Interview } from './interview.entity';
import { Max, Min } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { Interview } from './interview.entity';
// import { Candidates } from './interview.entity';

// @Entity()
// export class Hr extends BaseEntity {
//    @PrimaryGeneratedColumn('uuid')
//    id: string;
//
//    @Column()
//    email: string;
//
//    @Column()
//    fullName: string;
//
//    @Column({})
//    company: string;
//
//    @Column()
//    maxReservedStudents: number;
//
//    /* Radek
//    @ManyToOne((type) => User, (user) => user.id)
//    hr: Hr;
//
//     */
//
//    @OneToOne(() => Interview, (interview) => interview.interviewer)
//    hrInterview: Interview;
// }

@Entity('hr')
export class Hr extends BaseEntity {
   //nie generujemy, bedzie kopiowany z user przy tworzeniu studenta
   @PrimaryColumn()
   hrId: string;

   // nazwa, not null
   @Column({ length: 50, nullable: false })
   fullName: string;

   // firma, not null
   @Column({ length: 50, nullable: false })
   company: string;

   // max. ilość studentów zarezerowanych do romozwy jednocześnie
   @Column({ type: 'smallint' })
   @Min(1)
   @Max(999)
   maxReservedStudents: number;

   @OneToOne(() => User, (user) => user.hr, { onDelete: 'CASCADE' })
   user: User;

   // test
   // @OneToMany(() => Candidates, (interview) => interview.student)
   // interview: Candidates;

   // test2
   @OneToMany(() => Interview, (interview) => interview.hr)
   interview: Interview[];
}
