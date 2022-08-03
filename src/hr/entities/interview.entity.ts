import {
   BaseEntity,
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Hr } from './hr.entity';

// student trafia na liste to zmienia status na do rozmowy, hr ma 10 dni jak nie to wraca spowrotem na dostępny

@Entity('interview')
export class Interview extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   interviewId: string;

   @Column()
   interviewTitle: string;

   @Column({ type: 'date' })
   date: string;

   @Column({ length: 36 })
   studentId: string;

   @Column({ name: 'hrId' })
   hrId: string;

   @ManyToOne(() => Hr, (hr) => hr.interview)
   @JoinColumn({
      name: 'hrId',
   })
   hr: Hr;
}
