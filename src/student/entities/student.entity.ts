import {
   BaseEntity,
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn,
   OneToMany,
   OneToOne,
   PrimaryColumn,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudentStatus } from '../../enums/student-status.enum';
import { WorkType } from '../../enums/work-type.enum';
import { ContactType } from '../../enums/contract-type.enum';
import { Apprenticeship } from '../../enums/apprenticeship.enum';
import { Min } from 'class-validator';
import { Candidates } from '../../hr/entities/interview.entity';

@Entity('student')
export class Student extends BaseEntity {
   //nie generujemy, bedzie kopiowany z user przy tworzeniu studenta
   @PrimaryColumn()
   studentId: string;

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

   // tablica url do gh - projekty z etapu bonusowego
   @Column('simple-array')
   bonusProjectUrls: string[];

   // not null
   @Column({
      nullable: false,
      type: 'enum',
      enum: StudentStatus,
      default: StudentStatus.AVAILABLE,
   })
   studentStatus: string;

   // not null
   @Column({ length: 15, nullable: false })
   tel: string;

   // not null
   @Column({ length: 18, nullable: false })
   firstName: string;

   // not null
   @Column({ length: 30, nullable: false })
   lastName: string;

   // not null, unikalny
   @Column({
      length: 60,
      // tymczasowo wyrzucam, bo dziala i wywala na pliku csv
      // unique: true,
      nullable: false,
   })
   githubUserName: string;

   // tablica url do gh - do porfolio
   @Column('simple-array')
   portfolioUrls: string[];

   // tablica url do gh - do projektu zaliczeniowego
   @Column('simple-array')
   projectUrls: string[];

   // tekst o sobie
   @Column({ type: 'text' })
   bio: string;

   // enum do typu pracy, domyslnie any
   @Column({
      type: 'enum',
      enum: WorkType,
      default: WorkType.ANY,
   })
   expectedTypeOfWork: string;

   @Column({ length: 30 })
   targetWorkCity: string;

   // enum do oczekiwanego rodzaju umowy, domyslnie any
   @Column({
      type: 'enum',
      enum: ContactType,
      default: ContactType.ANY,
   })
   expectedContractType: string;

   @Column({ length: 5 })
   expectedSalary: string;

   // enum do zgody na staż przed zatrudnieniem, domyslnie no
   @Column({
      type: 'enum',
      enum: Apprenticeship,
      default: Apprenticeship.NO,
   })
   canTakeApprenticeship: string;

   // int >=0
   @Column({
      type: 'integer',
   })
   @Min(0)
   monthsOfCommercialExp: number;

   // long text, spaces must be kept
   @Column({ type: 'longtext' })
   education: string;

   // long text, spaces must be kept
   @Column({ type: 'longtext' })
   workExperience: string;

   // long text, spaces must be kept
   @Column({ type: 'longtext' })
   courses: string;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
   user: User;

   // test
   @OneToMany(() => Candidates, (interview) => interview.student)
   interview: Candidates;
}
