import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hr extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   fullName: string;

   @Column({})
   company: string;

   @Column()
   maxReservedStudents: number;
}
