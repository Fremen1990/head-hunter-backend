import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn,
   OneToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../enums/role.enum';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ length: 255 })
   email: string;

   @Column({ length: 128 })
   pwdHash: string;

   @Column({ nullable: false, length: 15 })
   role: Role;

   @Column({ nullable: true })
   registrationToken: string | null;

   @Column({ nullable: true, default: null })
   resetPasswordToken: string | null;

   @Column({ nullable: true, default: null })
   currentSessionToken: string | null;

   @Column({
      default: false,
   })
   active: boolean;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   @OneToOne(() => Student, (student) => student.user)
   @JoinColumn()
   student: Student;
}
