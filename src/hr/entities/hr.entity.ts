import {
   BaseEntity,
   Column,
   Entity,
   OneToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Interview } from './interview.entity';

@Entity()
export class Hr extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   email: string;

   @Column()
   fullName: string;

   @Column({})
   company: string;

   @Column()
   maxReservedStudents: number;

   /* Radek
   @ManyToOne((type) => User, (user) => user.id)
   hr: Hr;  
   
    */

   @OneToOne(() => Interview, (interview) => interview.interviewer)
   hrInterview: Interview;
}
