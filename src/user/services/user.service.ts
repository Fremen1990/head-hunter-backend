import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import {
   getUserProfileResponse,
   RegisterUserResponse,
   userProfile,
} from '../../interfaces/user';
import { RegisterUserDto } from '../dto/register-user.dto';
import { decrypt, encrypt, hashPwd } from '../../utils/pwd-tools';
import { Student } from '../../student/entities/student.entity';
import { Hr } from '../../hr/entities/hr.entity';

@Injectable()
export class UserService {
   filter(user: User): RegisterUserResponse {
      const { id, registrationToken, active } = user;
      return { id, registrationToken, active };
   }

   filterProfile(user: User): userProfile {
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
      userPwd: RegisterUserDto,
      id: string,
      registrationToken: string,
   ): Promise<RegisterUserResponse> {
      const user = await this.getOneUser(id);

      if (!user) {
         throw new Error('No user in database with such ID');
      }

      if (!user.registrationToken && Number(user.active) === 1) {
         throw new Error('Student already registered!');
      }

      if (user.registrationToken !== registrationToken) {
         throw new Error('Incorrect token in parameter!');
      }

      if (user.registrationToken === registrationToken) {
         user.registrationToken = null;
      } else {
         throw new Error('Ooops! Still something is wrong');
      }
      user.encryptedPwd = encrypt(userPwd.pwd);
      user.active = true;

      await user.save();

      return this.filter(user);
   }

   async getOneUser(id: string): Promise<User> {
      const user = await User.findOneById(id);
      if (!user) {
         throw new HttpException(
            `Cannot find user ID:${id}`,
            HttpStatus.NOT_FOUND,
         );
      } else {
         return user;
      }
   }

   async getAllUsers(): Promise<User[]> {
      return await User.find();
   }

   async getCurrentUserProfile(user): Promise<getUserProfileResponse> {
      const userInfo = this.filterProfile(user);
      let userDetails;

      if (user.role === 'student') {
         userDetails = await Student.findBy({ studentId: user.id });
      } else if (user.role === 'hr') {
         userDetails = await Hr.findBy({ hrId: user.id });
      }

      return { userInfo, userDetails };
   }
}
