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
export class Student extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      length: 255,
   })
   email: string;

   @Column({
      length: 255,
      default: 'available',
   })
   studentStatus: string;

   @Column({
      type: 'tinyint',
   })
   courseCompletion: number;
   //
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
   //
   // // tabela one to many z kursami kazdego ze studentow?
   @Column()
   bonusProjectUrls: string;
   //
   // tel: string;
   //
   // firstName: string;
   //
   // lastName: string;
   //
   // githubUserName: string;
   //
   // portfolioUrls: string;
   //
   // projectUrls: string;
   //
   // bio: string;
   //
   // expectedTypeOfWork: string;
   //
   // targetWorkCity: string;
   //
   // expectedContractType: string;
   //
   // expectedSalary: string;
   //
   // canTakeApprenticeship: string;
   //
   // monthsOfCommercialExp: string;
   //
   // education: string;
   //
   // workExperience: string;
   //
   // courses: string;

   @OneToOne(() => User, (user) => user.email)
   @JoinColumn()
   user: User;
}
