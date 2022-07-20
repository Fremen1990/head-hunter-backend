import {
   BaseEntity,
   Column,
   Entity,
   Generated,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Student extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      length: 255,
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
      type: 'tinyint',
      default: 0,
   })
   active: boolean;

   @Column({
      type: 'tinyint',
      default: 0,
   })
   studentStatus: number;

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

   // tabela one to many z kursami kazdego ze studentow?
   @Column()
   bonusProjectUrls: string;
}
