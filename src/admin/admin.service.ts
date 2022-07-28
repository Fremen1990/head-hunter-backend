import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ImportUserDto } from './dto/import-user.dto';
import { ImportUserResponse } from '../interfaces/user';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
// import { UploadFileDto } from './dto/upload-file.dto';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../interfaces/upload';
import { MulterDiskUploadedFiles } from '../interfaces/files';

// utils imports
import { storageDir } from '../utils/storage';
import { parse } from 'papaparse';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import * as path from 'path';
import nanoToken from '../utils/nano-token';
// import { v4 as uuid } from 'uuid';
import { ImportHrDto } from './dto/import-hr.dto';
import { Hr } from '../hr/hr.entity';
import { Role } from '../enums/role.unum';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { decrypt, encrypt } from '../utils/pwd-tools';

@Injectable()
export class AdminService {
   constructor(
      @Inject(MailService) private mailService: MailService,
      @Inject(UserService) private userService: UserService,
   ) {}

   //----------------- Import STUDENTS from request to database ------------------
   async importStudents(
      newImportUsers: ImportUserDto[],
   ): Promise<ImportUserResponse> {
      console.log('users from front-end', newImportUsers);

      //------ forOf to add to map through array -------
      let newUsersCounter = 0;
      for (const userItem of newImportUsers) {
         //------ create new user -------
         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            //---------------- User Table insert------------------
            const user = await new User();

            user.email = userItem.email;
            user.encryptedPwd = encrypt(nanoToken());
            user.role = Role.Student;
            user.registrationToken = nanoToken();
            await user.save();
            //----------------- User Table insert END------------------

            //------------------- student Table insert START-------------------
            const student = new Student();
            student.id = user.id;
            student.courseCompletion = userItem.courseCompletion;
            student.courseEngagement = userItem.courseEngagement;
            student.projectDegree = userItem.projectDegree;
            student.teamProjectDegree = userItem.teamProjectDegree;
            student.bonusProjectUrls = userItem.bonusProjectUrls;
            await student.save();
            //---------------- student Table insert END-----------------------
            newUsersCounter++;
            await this.mailService.sendRegistrationLink(user);
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

   //----------------- Upload file to hard, parse it, return array and remove file ------------------
   async uploadFile(
      files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface | UploadFileFailedInterface> {
      const uploadFile = files?.usersImport?.[0] ?? null;

      const path_to_import = path.join(
         storageDir(),
         'upload-file',
         'users-import-temp.csv',
      );

      console.log(path_to_import);

      // check if the file is not empty, not too big, and has the right extension

      if (!uploadFile) {
         return {
            UploadStatus: 'failed',
            Error: 'No file uploaded',
         };
      }

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
            path.join(storageDir(), 'upload-file', 'users-import-temp.csv'),
         );
         return data;
      }
   }

   async importHr(newImportHr: ImportHrDto[]): Promise<ImportUserResponse> {
      //------ forOf to add to map through array -------
      let newUsersCounter = 0;
      for (const userItem of newImportHr) {
         //------ create new user -------
         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            //---------------- Create new id ------------------
            // const newId = uuid();
            //---------------- User Table insert------------------
            const user = new User();
            user.email = userItem.email;
            user.encryptedPwd = encrypt(nanoToken());
            user.role = Role.Hr;
            user.registrationToken = nanoToken();
            await user.save();

            //----------------- User Table insert END------------------

            //------------------- hr Table insert START-------------------
            const hr = new Hr();
            hr.id = user.id;
            hr.fullName = userItem.fullName;
            hr.company = userItem.company;
            hr.maxReservedStudents = userItem.maxReservedStudents;
            await hr.save();
            //---------------- hr Table insert END-----------------------
            newUsersCounter++;
            await this.mailService.sendRegistrationLink(user);
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

   //----------------- Get All students ------------------
   async getAllStudents(): Promise<Student[]> {
      return await Student.find();
   }

   //----------------- Get All Hr ------------------
   async getAllHr(): Promise<Hr[]> {
      return await Hr.find();
   }

   //---Send email with registration link to all users available in DB that are not registered yest ---
   async mailUsers(): Promise<any> {
      const users = await this.userService.getAllUsers();
      let counter = 0;
      for (const user of users) {
         if (!user.active) {
            await this.mailService.sendRegistrationLink(user);
            counter++;
         }
      }

      return {
         'Ilość ponownie wysłanych maili': counter,
      };

      // return {
      //    text: 'Poszło przez serwis',
      //    user,
      //    pwd: decrypt(user.encryptedPwd),
      // };
   }
}
