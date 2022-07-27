import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Interview extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   interviewTitle: string;

   @Column()
   interviewDescription: string;

   @Column()
   interviewDate: string;
}
