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

@Entity()
export class Student extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   email: string;

   @Column({
      type: 'tinyint',
   })
   courseCompletion: number;

   @Column({
      type: 'tinyint',
   })
   courseEngagement: number;

   @Column({
      type: 'tinyint',
   })
   projectDegree: number;

   @Column({
      type: 'tinyint',
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
      // tymczasowo wyrzucam, bo dziala i wywala na p[liku csv
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
   monthsOfCommercialExp: string;
   @Column()
   education: string;

   @Column()
   workExperience: number;

   @Column()
   courses: string;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   @OneToOne(() => User, (user) => user.student)
   @JoinColumn()
   user: User;
}
