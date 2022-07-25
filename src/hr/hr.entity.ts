import {
   BaseEntity,
   Column,
   Entity,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Hr extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   fullName: string;

   @Column({})
   company: string;

   @Column()
   maxReservedStudents: number;

   @ManyToOne((type) => User, (user) => user.id)
   hr: Hr;
}
