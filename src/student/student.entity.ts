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
   @Column('simple-array')
   bonusProjectUrls: string[];
   //// details to Columnt( here to be completed if needed  )
   @Column()
   tel: string;
   @Column()
   firstName: string;
   @Column()
   lastName: string;
   @Column()
   githubUserName: string;
   @Column()
   portfolioUrls: string;
   @Column()
   projectUrls: string;
   @Column()
   bio: string;
   @Column()
   expectedTypeOfWork: string;
   @Column()
   targetWorkCity: string;
   @Column()
   expectedContractType: string;
   @Column()
   expectedSalary: string;
   @Column()
   canTakeApprenticeship: string;
   @Column()
   monthsOfCommercialExp: string;
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

   @OneToOne(() => User, (user) => user.email)
   @JoinColumn()
   user: User;
}
