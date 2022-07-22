import { Injectable } from '@nestjs/common';
import { ImportUserDto } from './dto/import-user.dto';
import { ImportUserResponse } from '../interfaces/user';
import { User } from '../user/user.entity';

@Injectable()
export class AdminService {
   async importUsersCsv(
      newImportUsers: ImportUserDto,
   ): Promise<ImportUserResponse> {
      console.log('servis IMPORT');

      const user = new User();

      user.email = newImportUsers.email;
      user.role = newImportUsers.role;

      // add function which generate registration token
      user.registerTokenId = 'frijsbvinbitvdhtjknbv';

      // Here create new student
      // const student = new Student();
      // student.courseCompletion = newImportUsers.courseCompletion;

      await user.save();
      return user;
   }
}
