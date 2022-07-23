import { Injectable } from '@nestjs/common';
import { ImportUserDto } from './dto/import-user.dto';
import { ImportUserResponse } from '../interfaces/user';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
// import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFileResponseInterface } from '../interfaces/upload';
import { MulterDiskUploadedFiles } from '../interfaces/files';

// utils imports
import { storageDir } from '../utils/storage';
import { parse } from 'papaparse';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs';
import nanoToken from '../utils/nanoToken';

@Injectable()
export class AdminService {
   async importUsers(
      newImportUsers: ImportUserDto[],
   ): Promise<ImportUserResponse> {
      console.log('users from front-end', newImportUsers);

      //------ forOf to add to map through array -------
      let newUsersCounter = 0;
      for (const userItem of newImportUsers) {
         //------ create new user -------
         const user = User.findOneBy({ email: userItem.email });
         if (!user) {
            //---------------- User Table insert------------------
            const user = new User();
            user.email = userItem.email;
            user.role = userItem.role;
            user.registerTokenId = nanoToken();
            await user.save();
            //----------------- User Table insert END------------------

            //------------------- student Table insert START-------------------
            const student = new Student();
            student.email = userItem.email;
            student.courseCompletion = userItem.courseCompletion;
            student.courseEngagement = userItem.courseEngagement;
            student.projectDegree = userItem.projectDegree;
            student.teamProjectDegree = userItem.teamProjectDegree;
            student.bonusProjectUrls = userItem.bonusProjectUrls;
            await student.save();
            //---------------- student Table insert END-----------------------
            newUsersCounter++;
         }

         if (user) {
            console.log('user already exists', user);
         }
      }

      return {
         importSuccess: 'OK',
         newUsersCounter: newUsersCounter,
      };
   }

   async uploadFile(
      files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface> {
      const uploadFile = files?.usersImport?.[0] ?? null;

      const path_to_import = path.join(
         storageDir(),
         'students-file',
         'users-import-temp.csv',
      );

      // check if the file is not empty, not too big, and has the right extension

      if (uploadFile) {
         const csvFile = readFileSync(path_to_import);
         const csvData = csvFile.toString();

         const { data } = await parse(csvData, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.replace('#', '').trim(),
            complete: (results) => results.data,
         });

         console.log('PARSED DATA!!!!!!', data);

         fs.unlinkSync(
            path.join(storageDir(), 'students-file', 'users-import-temp.csv'),
         );
         return data;
      }
   }
}
