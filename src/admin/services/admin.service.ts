import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
   createOneUserResponse,
   ImportUserResponse,
} from '../../interfaces/user';
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../../interfaces/upload';
import { MulterDiskUploadedFiles } from '../../interfaces/files';
import { v4 as uuid } from 'uuid';

// utils imports
import { storageDir } from '../../utils/storage';
import { parse } from 'papaparse';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import * as path from 'path';
import nanoToken from '../../utils/nano-token';
import { HrDto } from '../dto/hr.dto';
import { Hr } from '../../hr/entities/hr.entity';
import { Role } from '../../enums/role.enum';
import { StudentDto } from '../dto/student.dto';
import { hashPwd } from '../../utils/hash-pwd';

@Injectable()
export class AdminService {
   // ---------------ADD-ONE-STUDENT START-------------------------
   async createOneStudent(
      newStudent: StudentDto,
   ): Promise<createOneUserResponse> {
      //------ create new user -------
      const user = await User.findOneBy({ email: newStudent.email });

      if (user) {
         throw new HttpException('Student already exist', HttpStatus.CONFLICT);
      }
      const createdUsersList = [];

      //---------------- Generating shared id for both tables------------------
      const sharedId = uuid();
      //---------------- User Table insert------------------
      const newUser = await new User();
      newUser.id = sharedId;
      newUser.email = newStudent.email;
      newUser.pwdHash = hashPwd(newStudent.pwd);
      newUser.role = Role.STUDENT;
      newUser.registrationToken = nanoToken();
      await newUser.save();
      //----------------- User Table insert END------------------

      //------------------- student Table insert START-------------------
      const student = new Student();
      student.id = sharedId;
      // student.email = userItem.email;
      student.courseCompletion = newStudent.courseCompletion;
      student.courseEngagement = newStudent.courseEngagement;
      student.projectDegree = newStudent.projectDegree;
      student.teamProjectDegree = newStudent.teamProjectDegree;
      student.bonusProjectUrls = newStudent.bonusProjectUrls;
      await student.save();
      createdUsersList.push(newStudent.email);
      //---------------- student Table insert END-----------------------

      return {
         createUserStatus: 'OK',
         createdUser: newUser,
      };
   }
   // ---------------ADD-ONE-STUDENT END-------------------------
   // ---------------ADD-ONE-HR START-------------------------
   async createOneHr(newHr: HrDto): Promise<createOneUserResponse> {
      //------ create new user -------
      const user = await User.findOneBy({ email: newHr.email });
      const createdUsersList = [];

      if (user) {
         throw new HttpException(
            `Hr with email: ${user.email} already exist`,
            HttpStatus.CONFLICT,
         );
      }

      //---------------- Generating shared id for both tables------------------
      const sharedId = uuid();
      //---------------- User Table insert------------------
      const newUser = new User();
      newUser.id = sharedId;
      newUser.email = newHr.email;
      newUser.role = Role.HR;
      newUser.registrationToken = nanoToken();
      await newUser.save();
      //----------------- User Table insert END------------------

      //------------------- hr Table insert START-------------------
      const hr = new Hr();
      hr.id = sharedId;
      hr.email = newHr.email;
      hr.fullName = newHr.fullName;
      hr.company = newHr.company;
      hr.maxReservedStudents = newHr.maxReservedStudents;
      await hr.save();
      createdUsersList.push(newHr.email);
      //---------------- student Table insert END-----------------------

      return {
         createUserStatus: 'OK',
         createdUser: newUser,
      };
   }
   // ---------------ADD-ONE-HR END-------------------------

   //----------------- Import STUDENTS from request to database ------------------
   async importStudents(
      newImportUsers: StudentDto[],
   ): Promise<ImportUserResponse> {
      //------ forOf to add to map through array -------
      const createdUsersList = [];
      const duplicatedUsersList = [];
      for (const userItem of newImportUsers) {
         //------ create new user -------
         // // todo USE SERVICE FOR ADD ONE TO IMPORT ALL
         // await this.createOneStudent(userItem);

         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            //---------------- Generating shared ID for both tables------------------
            const sharedId = uuid();
            //---------------- User Table insert------------------
            const user = await new User();
            user.id = sharedId;
            user.email = userItem.email;
            user.pwdHash = hashPwd(nanoToken());
            user.role = Role.STUDENT;
            user.registrationToken = nanoToken();
            await user.save();
            //----------------- User Table insert END------------------

            //------------------- student Table insert START-------------------
            const student = new Student();
            student.id = sharedId;
            student.email = userItem.email;
            student.courseCompletion = userItem.courseCompletion;
            student.courseEngagement = userItem.courseEngagement;
            student.projectDegree = userItem.projectDegree;
            student.teamProjectDegree = userItem.teamProjectDegree;
            student.bonusProjectUrls = userItem.bonusProjectUrls;
            await student.save();
            //---------------- student Table insert END-----------------------
            createdUsersList.push(user.email);
         }
         if (user) {
            duplicatedUsersList.push(user.email);
         }
      }

      return {
         importSuccess: 'OK',
         createdUsers: createdUsersList,
         newUsersCounter: createdUsersList.length,
         duplicatedUsers: duplicatedUsersList,
         duplicatedUsersCounter: duplicatedUsersList.length,
         message: `Feel safe, we add only unique users :) in this case added ${createdUsersList.length} users`,
      };
   }

   async importHr(newImportHr: HrDto[]): Promise<ImportUserResponse> {
      //------ forOf to add to map through array -------
      const createdUsersList = [];
      const duplicatedUsersList = [];
      for (const userItem of newImportHr) {
         //------ create new user -------
         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            //---------------- Generating shared ID for both tables------------------
            const sharedId = uuid();
            //---------------- User Table insert------------------
            const user = new User();
            user.id = sharedId;
            user.email = userItem.email;
            user.role = Role.HR;
            user.registrationToken = nanoToken();
            await user.save();
            //----------------- User Table insert END------------------

            //------------------- hr Table insert START-------------------
            const hr = new Hr();
            hr.id = sharedId;
            hr.fullName = userItem.fullName;
            hr.company = userItem.company;
            hr.maxReservedStudents = userItem.maxReservedStudents;
            await hr.save();
            //---------------- hr Table insert END-----------------------
            createdUsersList.push(user.email);
         }

         if (user) {
            duplicatedUsersList.push(user.email);
         }
      }

      return {
         importSuccess: 'OK',
         createdUsers: createdUsersList,
         newUsersCounter: createdUsersList.length,
         duplicatedUsers: duplicatedUsersList,
         duplicatedUsersCounter: duplicatedUsersList.length,
         message: `Feel safe, we add only unique users :) in this case added ${createdUsersList.length} users`,
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

      if (!uploadFile) {
         throw new HttpException(
            'No file has been uploaded',
            HttpStatus.NOT_FOUND,
         );
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

         //----------------- Remove file ------------------
         try {
            fs.unlinkSync(
               path.join(storageDir(), 'upload-file', 'users-import-temp.csv'),
            );
         } catch (e) {
            throw new HttpException(
               'Cannot remove file',
               HttpStatus.I_AM_A_TEAPOT,
            );
         }
         return data;
      }
   }
}
