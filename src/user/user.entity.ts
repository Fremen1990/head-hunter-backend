import {
   BaseEntity,
   Column,
   Entity,
   Generated,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      length: 255,
   })
   email: string;

   @Column()
   pwdHash: string;

   @Column()
   role: string;

   @Column({
      nullable: true,
   })
   @Generated('uuid')
   registerTokenId: string | null;

   @Column({ nullable: true, default: null })
   resetPwdTokenId: string | null;

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
}
