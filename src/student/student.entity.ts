import {
   BaseEntity,
   Column,
   Entity,
   Generated,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import {
   StudentInterface,
   Course,
   WorkType,
   ContractType,
   Active,
} from '../interfaces/student';
import { HrEntity } from '../hr/hr.entity';

@Entity()
export class Student extends BaseEntity implements StudentInterface {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      length: 100,
   })
   email: string;

   @Column()
   pwdHash: string;

   @Column({
      nullable: true,
   })
   @Generated('uuid')
   registerTokenId: string | null;

   @Column({
      nullable: true,
      default: null,
   })
   currentSessionTokenId: string | null;

   @Column({
      default: false,
   })
   active: boolean;

   @Column({
      length: 10,
      default: 'available',
   })
   status: Active;

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

   @Column({
      type: 'varchar',
      length: 8,
   })
   preferredWorkType: WorkType;

   @Column({
      type: 'varchar',
      length: 20,
   })
   preferredCity: string;

   @Column()
   contractType: ContractType;

   @Column({
      nullable: true,
   })
   minSalary: number | null;

   @Column({
      nullable: true,
   })
   maxSalary: number | null;

   @Column()
   freeInternship: boolean;

   @Column({
      default: null,
   })
   comExperience: number;

   @Column({
      type: 'json',
   })
   courses: Course[];

   @Column({
      type: 'text',
      default: null,
      nullable: true,
   })
   education: string | null;

   @Column({
      type: 'text',
      default: null,
      nullable: true,
   })
   aboutMe: string | null;

   @Column({
      type: 'text',
      default: null,
      nullable: true,
   })
   workExperience: string | null;

   @Column()
   bonusProjectUrls: string;

   @Column()
   endMegaKProjectUrls: string;

   @Column({
      nullable: true,
   })
   portfolioUrls: string;

   @ManyToOne((type) => HrEntity, (entity) => entity.studentsAdded)
   hrInterestedIn: HrEntity;
}
