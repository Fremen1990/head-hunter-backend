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
import { User } from '../../user/entities/user.entity';
import { StudentStatus } from '../../enums/student-status.enum';
import { WorkType } from '../../enums/work-type.enum';
import { ContactType } from '../../enums/contract-type.enum';
import { Apprenticeship } from '../../enums/apprenticeship.enum';
import { Interview } from '../../hr/entities/interview.entity';

@Entity()
export class Student extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   email: string;

   @Column({
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
   })
   courseCompletion: number;

   @Column({
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
   })
   courseEngagement: number;

   @Column({
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
   })
   projectDegree: number;

   @Column({
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
   })
   teamProjectDegree: number;

   @Column('simple-array')
   bonusProjectUrls: string[];

   @Column({
      length: 20,
      default: StudentStatus.available,
      nullable: false,
   })
   studentStatus: string;

   //// details to Columnt( here to be completed if needed  )
   @Column({ length: 15 })
   tel: string;

   @Column({ length: 18, nullable: false })
   firstName: string;

   @Column({ length: 30, nullable: false })
   lastName: string;

   @Column({
      length: 60,
      // tymczasowo wyrzucam, bo dziala i wywala na pliku csv
      // unique: true,
      nullable: false,
   })
   githubUserName: string;

   @Column({
      nullable: true,
   })
   portfolioUrls: string;

   @Column()
   projectUrls: string;

   @Column({ length: 255 })
   bio: string;

   @Column({ default: WorkType.any, length: 20 })
   expectedTypeOfWork: string;

   @Column({ length: 30 })
   targetWorkCity: string;

   @Column({ default: ContactType.any, length: 20 })
   expectedContractType: string;

   @Column({ length: 5 })
   expectedSalary: string;

   @Column({ default: Apprenticeship.no, length: 3 })
   canTakeApprenticeship: string;

   @Column()
   monthsOfCommercialExp: number;

   @Column()
   education: string;

   @Column()
   workExperience: string;

   @Column()
   courses: string;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   /* Radek
    @ManyToOne((type) => User, (user) => user.id)
    student: Student;
    */

   @OneToOne(() => Interview, (interview) => interview.student)
   interview: Interview;

   @OneToOne(() => User, (user) => user.student)
   @JoinColumn()
   user: User;
}
