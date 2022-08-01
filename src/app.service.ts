import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiStatus } from './app.controller';
import { User } from './user/entities/user.entity';
import { AdminDto } from './admin/dto/admin.dto';
import { v4 as uuid } from 'uuid';
import { encrypt } from './utils/pwd-tools';
import { Role } from './enums/role.enum';

@Injectable()
export class AppService {
   getHello(): ApiStatus {
      return {
         apiName: 'MegaK Head Hunter API',
         message:
            'Welcome to our api which is gathering students and HRs together to make them both happy :)',
         status: 'OK',
      };
   }

   async createAdminUser(newAdmin: AdminDto) {
      const user = await User.findOneBy({ email: newAdmin.email });

      if (user) {
         throw new HttpException(
            'Admin with this email already exist',
            HttpStatus.CONFLICT,
         );
      }

      const admin = await new User();

      admin.id = uuid();
      admin.email = newAdmin.email;
      admin.encryptedPwd = encrypt(newAdmin.pwd);
      admin.role = Role.ADMIN;
      admin.active = true;

      await admin.save();

      return {
         createUserStatus: `Admin ${newAdmin.email} has been created`,
         createdUser: admin,
      };
   }
}
