import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createOneUserResponse, ImportUserResponse } from '../../types/user';
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../../types/upload';
import { MulterDiskUploadedFiles } from '../../types/files';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

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
import { encrypt } from '../../utils/pwd-tools';
import { MailService } from '../../mail/mail.service';
import { UserService } from '../..//user/services/user.service';
import { getRandomArbitrary } from '../../utils/random-number';
import { ImportRandomStudentsResponse } from '../../types/student';

@Injectable()
export class AdminService {
   constructor(
      @Inject(MailService) private mailService: MailService,
      @Inject(UserService) private userService: UserService,
   ) {}
   // method set from most important(complex) to least
   // 1. upload file
   // 2. import students
   // 3. import hr
   // 4. create one student
   // 5. create one hr
   // 5. send email

   // last tested 31.07 - @Radek - feature/db-to-test
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

   // one method to join funtionality of two below - import(newImportUser, userType) ????

   // last tested 31.07 - @Radek - feature/db-to-test
   async importStudents(
      newImportUsers: StudentDto[],
   ): Promise<ImportUserResponse> {
      const createdUsersList = [];
      const duplicatedUsersList = [];

      for (const userItem of newImportUsers) {
         //------ create new user -------
         // // todo USE SERVICE FOR ADD ONE TO IMPORT ALL
         // await this.createOneStudent(userItem);

         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            const sharedId = uuid();

            const user = await new User();
            const student = new Student();

            student.studentId = sharedId;
            student.courseCompletion = userItem.courseCompletion;
            student.courseEngagement = userItem.courseEngagement;
            student.projectDegree = userItem.projectDegree;
            student.teamProjectDegree = userItem.teamProjectDegree;
            student.bonusProjectUrls = userItem.bonusProjectUrls;
            await student.save();

            user.id = sharedId;
            user.email = userItem.email;
            user.encryptedPwd = encrypt(nanoToken());
            user.role = Role.STUDENT;
            user.registrationToken = nanoToken();
            user.student = student;
            await user.save();

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

   // last tested 31.07 - @Radek - feature/db-to-test
   async importHr(newImportHr: HrDto[]): Promise<ImportUserResponse> {
      const createdUsersList = [];
      const duplicatedUsersList = [];

      for (const userItem of newImportHr) {
         //------ create new user -------
         const user = await User.findOneBy({ email: userItem.email });
         if (!user) {
            const sharedId = uuid();

            const user = new User();
            const hr = new Hr();

            hr.hrId = sharedId;
            hr.fullName = userItem.fullName;
            hr.company = userItem.company;
            hr.maxReservedStudents = userItem.maxReservedStudents;
            await hr.save();

            user.id = sharedId;
            user.email = userItem.email;
            user.encryptedPwd = encrypt(nanoToken());
            user.role = Role.HR;
            user.registrationToken = nanoToken();
            user.hr = hr;
            await user.save();

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

   // last tested 31.07 - @Radek - feature/db-to-test
   async createOneStudent(
      newStudent: StudentDto,
   ): Promise<createOneUserResponse> {
      let user = await User.findOneBy({ email: newStudent.email });
      const createdUsersList = [];

      if (user) {
         throw new HttpException('Student already exist', HttpStatus.CONFLICT);
      }

      const sharedId = uuid();

      user = await new User();
      const student = new Student();

      student.studentId = sharedId;
      student.courseCompletion = newStudent.courseCompletion;
      student.courseEngagement = newStudent.courseEngagement;
      student.projectDegree = newStudent.projectDegree;
      student.teamProjectDegree = newStudent.teamProjectDegree;
      student.bonusProjectUrls = newStudent.bonusProjectUrls;
      await student.save();

      user.id = sharedId;
      user.email = newStudent.email;
      user.encryptedPwd = encrypt(newStudent.pwd) ?? encrypt(nanoToken());
      user.role = Role.STUDENT;
      user.registrationToken = nanoToken();
      user.student = student;
      await user.save();

      createdUsersList.push(newStudent.email);
      //---------------- student Table insert END-----------------------

      // await this.mailService.sendRegistrationLink(user); // to be tested only in one user, not import mass students

      return {
         createUserStatus: 'OK',
         createdUser: user,
      };
   }

   // last tested 31.07 - @Radek - feature/db-to-test
   async createOneHr(newHr: HrDto): Promise<createOneUserResponse> {
      let user = await User.findOneBy({ email: newHr.email });
      const createdUsersList = [];

      if (user) {
         throw new HttpException(
            `Hr with email: ${user.email} already exist`,
            HttpStatus.CONFLICT,
         );
      }

      const sharedId = uuid();

      user = new User();
      const hr = new Hr();

      hr.hrId = sharedId;
      hr.fullName = newHr.fullName;
      hr.company = newHr.company;
      hr.maxReservedStudents = newHr.maxReservedStudents;
      await hr.save();

      user.id = sharedId;
      user.email = newHr.email;
      user.encryptedPwd = encrypt(newHr.pwd) ?? encrypt(nanoToken());
      user.role = Role.HR;
      user.registrationToken = nanoToken();
      user.hr = hr;
      await user.save();

      createdUsersList.push(newHr.email);

      return {
         createUserStatus: 'OK',
         createdUser: user,
      };
   }

   // last tested 31.07 - @Radek - feature/db-to-test
   //----------------- Get All students ------------------
   // te metody do napisania w poszczegolbych modułach i tutaj tylko referencja
   async getAllStudents(): Promise<Student[]> {
      return await Student.find();
   }

   // last tested 31.07 - @Radek - feature/db-to-test
   //----------------- Get All Hr ------------------
   async getAllHr(): Promise<Hr[]> {
      return await Hr.find();
   }

   // last tested 31.07 - @Radek - feature/db-to-test
   // ---Send email with registration link to all users available in DB that are not registered yest ---
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
   }

   // IMPORT FAKE STUDENTS
   async importRandomFakeStudentsData(): Promise<any> {
      const createdUsersList = [];
      const studentsNumberArray = Array.from({ length: 100 }, (v, i) => i);

      for (const userItem of studentsNumberArray) {
         //------ create new user -------
         // // todo USE SERVICE FOR ADD ONE TO IMPORT ALL
         // await this.createOneStudent(userItem);

         const sharedId = uuid();

         const user = await new User();
         const student = new Student();

         // STUDENT
         student.studentId = sharedId;
         student.courseCompletion = getRandomArbitrary(0, 6);
         student.courseEngagement = getRandomArbitrary(0, 6);
         student.projectDegree = getRandomArbitrary(0, 6);
         student.teamProjectDegree = getRandomArbitrary(0, 6);
         student.bonusProjectUrls = [
            faker.internet.domainName(),
            faker.internet.domainName(),
         ];
         student.tel = faker.phone.number();
         student.firstName = faker.name.firstName();
         student.lastName = faker.name.lastName();
         student.githubUserName = faker.internet.userName();
         student.portfolioUrls = [
            faker.internet.domainName(),
            faker.internet.domainName(),
         ];
         student.projectUrls = [
            faker.internet.domainName(),
            faker.internet.domainName(),
         ];
         student.bio = faker.name.jobDescriptor();
         student.targetWorkCity = faker.address.cityName();
         student.expectedSalary = faker.finance.amount(1000, 100000);
         student.monthsOfCommercialExp = getRandomArbitrary(0, 24);
         student.education = faker.animal.cat();
         student.workExperience = faker.vehicle.vehicle();
         student.courses = faker.git.commitMessage();

         await student.save();

         // USER
         user.id = sharedId;
         user.email = faker.internet.exampleEmail();
         user.encryptedPwd = encrypt(nanoToken());
         user.role = Role.STUDENT;
         user.registrationToken = nanoToken();
         user.active = true;
         user.student = student;
         await user.save();

         createdUsersList.push({
            no: userItem,
            id: user.id,
            email: user.email,
         });
      }

      return createdUsersList;
   }
}
