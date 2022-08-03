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
import { Hr } from '../../hr/entities/hr.entity';
import { Interview } from '../../hr/entities/interview.entity';

@Entity('user')
export class User extends BaseEntity {
   // uuid generujemy i przypisujemy w zależności od typu użytkownika do Student lub HR
   // klucz główny
   @PrimaryGeneratedColumn('uuid')
   id: string;

   // unikalny
   @Column({
      length: 255,
      unique: true,
   })
   email: string;

   // hasło, not null
   @Column({
      length: 96,
      nullable: false,
   })
   encryptedPwd: string;

   // rola użytkonika - enum
   @Column({
      nullable: false,
      type: 'enum',
      enum: Role,
   })
   role: string;

   // token sesji, nullable bo będzie generowany tylko kiedy użytkonik będzie zalogowany
   @Column({ nullable: true, default: null })
   currentSessionToken: string | null;

   // token do rejestracji, nullable bo będzie kasowany po rejestracji
   @Column({ nullable: true })
   registrationToken: string | null;

   // token do zmiany hasła, nullable bo będzie tylko generwowany jeżeli użytkonik będzie chciał zmienić hasło
   @Column({ nullable: true, default: null })
   resetPasswordToken: string | null;

   // boolean - sprawdzanie czy użytkownik jest aktywny, domyślnie nie jest ( czyli zablokowany ),
   // po rejestracji status ulega zmianie na true
   @Column({
      default: false,
      type: 'boolean',
   })
   active: boolean;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   // Relacje

   // relacja one to one user <-> student, user moze byc tylko jednym studentem i odwrotnie
   // co zwraca, co chcemy dostać
   @OneToOne(() => Student, (student) => student.user, { onDelete: 'CASCADE' })
   // foreign key zawsze tam gdzie jest join coulumn
   @JoinColumn({
      //nazwa primary key
      name: 'studentId',
   })
   student: Student;

   @OneToOne(() => Hr, (hr) => hr.user, { onDelete: 'CASCADE' })
   @JoinColumn({
      name: 'hrId',
   })
   hr: Hr;
}
