import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RegisterUserResponse, UserProfile } from '../../types';
import { RegisterUserDto } from '../dto/register-user.dto';
import { encrypt } from '../../utils/pwd-tools';

@Injectable()
export class UserService {
   filter(user: User): RegisterUserResponse {
      const { id, registrationToken, active } = user;
      return { id, registrationToken, active };
   }

   // todo - delete in week 5th after task 'group project' ends
   filterProfile(user: User): UserProfile {
      const {
         id,
         email,
         role,
         currentSessionToken,
         active,
         created_at,
         updated_at,
      } = user;
      return {
         id,
         email,
         role,
         currentSessionToken,
         active,
         created_at,
         updated_at,
      };
   }

   async register(
      // userPwd: RegisterUserDto,
      id: string,
      registrationToken: string,
   ): Promise<RegisterUserResponse> {
      const user = await this.getOneUser(id);

      if (!user) {
         throw new HttpException(
            'No user in database with such ID',
            HttpStatus.NOT_FOUND,
         );
      }

      if (!user.registrationToken && Number(user.active) === 1) {
         throw new HttpException(
            'Student already registered',
            HttpStatus.CONFLICT,
         );
      }

      if (user.registrationToken !== registrationToken) {
         throw new HttpException(
            'Incorrect token in parameter',
            HttpStatus.CONFLICT,
         );
      }

      if (user.registrationToken === registrationToken) {
         user.registrationToken = null;
      } else {
         throw new Error('Ooops! Still something is wrong');
      }
      // user.encryptedPwd = encrypt(userPwd.pwd);
      user.active = true;

      await user.save();

      return this.filter(user);
   }

   async getOneUser(id: string): Promise<User> {
      // const user = await User.findOneById(id);
      // if (!user) {
      //    throw new HttpException(
      //       `Cannot find user ID:${id}`,
      //       HttpStatus.NOT_FOUND,
      //    );
      // } else {
      //    return user;
      // }
      const user = await User.findOneBy({ id });
      if (!user) {
         throw new HttpException(
            `Cannot find user ID: ${id}`,
            HttpStatus.NOT_FOUND,
         );
      }

      return user;
   }

   async getAllUsers(): Promise<User[]> {
      return await User.find();
   }

   async getCurrentUserProfile(user): Promise<any> {
      // const userInfo = this.filterProfile(user);
      let userDetails;

      if (user.role === 'student') {
         const student = await User.find({
            relations: ['student'],
            where: { id: user.id },
         });
         userDetails = student[0];
      } else if (user.role === 'hr') {
         const hr = await User.find({
            relations: ['hr'],
            where: { id: user.id },
         });
         userDetails = hr[0];
      } else if (user.role === 'admin') {
         const admin = await User.findBy({ id: user.id });
         userDetails = admin[0];
      }

      return userDetails;
   }
}
