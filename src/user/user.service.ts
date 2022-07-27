import { Injectable } from '@nestjs/common';
import { decrypt, encrypt, hashPwd } from '../utils/pwd-tools';
import { User } from './user.entity';
import { RegisterUserResponse } from '../interfaces/user';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
   filter(user: User): RegisterUserResponse {
      const { id, registrationToken, active } = user;
      return { id, registrationToken, active };
   }

   async register(
      userPwd: RegisterUserDto,
      id: string,
      registrationToken: string,
   ): Promise<RegisterUserResponse> {
      // nie wiem jak w insomnii wyrzucic dane z params i body jednoczesnie, ponizej obiekt data do sprawdzenia funcjonalnosci

      // const data = {
      //    pwd: '1234',
      // };

      console.log('serwis', id, registrationToken);

      const user = await this.getOneUser(id);

      console.log('student', user);

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
      return await User.findOneBy({ id });
   }

   async getAllUsers(): Promise<User[]> {
      return await User.find();
   }
}
