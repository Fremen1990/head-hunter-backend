import {
   BaseEntity,
   Column,
   Entity,
   Generated,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Student extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @IsString()
   @Column({
      length: 255,
   })
   email: string;

   @IsString()
   @Column({
      nullable: true,
      default: null,
   })
   pwdHash: string;

   @IsString()
   @Column({
      nullable: true,
   })
   @Generated('uuid')
   registerTokenId: string | null;

   @IsString()
   @Column({
      nullable: true,
      default: null,
   })
   currentSessionTokenId: string | null;

   @IsNumber()
   @Column({
      type: 'tinyint',
      default: 0,
   })
   active: boolean;

   @IsNumber()
   @Column({
      type: 'tinyint',
      default: 0,
   })
   studentStatus: number;

   @IsNumber()
   @Column({
      type: 'tinyint',
   })
   courseCompletion: number;

   @IsNumber()
   @Column({
      type: 'tinyint',
   })
   courseEngagement: number;

   @IsNumber()
   @Column({
      type: 'tinyint',
   })
   projectDegree: number;

   @IsNumber()
   @Column({
      type: 'tinyint',
   })
   teamProjectDegree: number;

   // tabela one to many z kursami kazdego ze studentow?
   @IsString()
   @Column()
   bonusProjectUrls: string;

   @IsString()
   tel: string;

   @IsString()
   firstName: string;

   @IsString()
   lastName: string;

   @IsString()
   githubUserName: string;

   @IsString()
   portfolioUrls: string;

   @IsString()
   projectUrls: string;

   @IsString()
   bio: string;

   @IsString()
   expectedTypeOfWork: string;

   @IsString()
   targetWorkCity: string;

   @IsString()
   expectedContractType: string;

   @IsString()
   expectedSalary: string;

   @IsString()
   canTakeApprenticeship: string;

   @IsString()
   monthsOfCommercialExp: string;

   @IsString()
   education: string;

   @IsString()
   workExperience: string;

   @IsString()
   courses: string;
}
