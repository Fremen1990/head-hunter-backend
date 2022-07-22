import { Injectable } from '@nestjs/common';
import { ImportUserDto } from './dto/import-user.dto';
import { ImportUserResponse } from '../interfaces/user';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
// import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFileResponseInterface } from '../interfaces/upload';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import { storageDir } from '../utils/storage';
import * as path from 'path';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';

@Injectable()
export class AdminService {
   async importUsersCsv(
      newImportUsers: ImportUserDto,
      files: MulterDiskUploadedFiles,
   ): Promise<ImportUserResponse> {
      console.log('servis IMPORT');

      //------ forEach to add to map through array -------
      // newImportUsers.forEach(newImportUser => {}

      //------ User Table insert-------
      const user = new User();
      user.email = newImportUsers.email;
      user.role = newImportUsers.role;
      // add function which generate registration token
      // nanoId jwt or any random
      user.registerTokenId = 'frijsbvinbitvdhtjknbv';
      await user.save();
      //------ User Table insert END-------

      //------ student Table insert START-------
      const student = new Student();
      student.email = newImportUsers.email;
      student.courseCompletion = newImportUsers.courseCompletion;
      student.courseEngagement = newImportUsers.courseEngagement;
      student.projectDegree = newImportUsers.projectDegree;
      student.teamProjectDegree = newImportUsers.teamProjectDegree;
      student.bonusProjectUrls = newImportUsers.bonusProjectUrls;
      await student.save();
      //------ student Table insert END-------

      return { importSuccess: 'OK' };
   }

   async uploadFile(
      files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface> {
      const uploadFile = files?.usersImport?.[0] ?? null;

      const pathh = path.join(
         storageDir(),
         'students-file',
         'users-import-temp.csv',
      );

      const csvFile = readFileSync(pathh);
      const csvData = csvFile.toString();

      const parsedCsv = await parse(csvData, {
         header: true,
         skipEmptyLines: true,
         transformHeader: (header) =>
            header.toLowerCase().replace('#', '').trim(),
         complete: (results) => results.data,
      });

      console.log('PARSED DATA!!!!!!', parsedCsv.data);

      return { files: 'ok' };
   }
}
