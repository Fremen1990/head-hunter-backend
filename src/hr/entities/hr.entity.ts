import {
   BaseEntity,
   Column,
   Entity,
   OneToMany,
   OneToOne,
   PrimaryColumn,
} from 'typeorm';

import { Max, Min } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Interview } from './interview.entity';

@Entity('hr')
export class Hr extends BaseEntity {
   //nie generujemy, bedzie kopiowany z user przy tworzeniu studenta
   @PrimaryColumn()
   hrId: string;

   // nazwa, not null
   @Column({ length: 50, nullable: false })
   fullName: string;

   // firma, not null
   @Column({ length: 50, nullable: false })
   company: string;

   // max. ilość studentów zarezerowanych do romozwy jednocześnie
   @Column({ type: 'smallint' })
   @Min(1)
   @Max(999)
   maxReservedStudents: number;

   @OneToOne(() => User, (user) => user.hr, { onDelete: 'CASCADE' })
   user: User;

   @OneToMany(() => Interview, (interview) => interview.hr, {
      onUpdate: 'CASCADE',
   })
   interview: Interview[];
}
