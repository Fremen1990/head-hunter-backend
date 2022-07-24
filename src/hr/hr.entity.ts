import {
   BaseEntity,
   Column,
   Entity,
   JoinColumn,
   OneToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

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

   @OneToOne(() => User, (user) => user.email)
   @JoinColumn()
   user: User;
}
