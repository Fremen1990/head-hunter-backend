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

   @Column({ length: 100 })
   encryptedPwd: string;

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

   /* Radek   
     @OneToMany((type) => Student, (student) => student.id)
   @JoinColumn()
   userStudent: Student;

   @OneToMany((type) => Hr, (hr) => hr.id)
   @JoinColumn()
   userHr: Hr;
    */

   @OneToOne(() => Student, (student) => student.user)
   @JoinColumn()
   student: Student;
}
