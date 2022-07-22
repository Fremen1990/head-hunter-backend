import { Injectable } from '@nestjs/common';
import { ImportUserDto } from './dto/import-user.dto';
import { ImportUserResponse } from '../interfaces/user';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadFileResponseInterface } from '../interfaces/upload';
import { MulterDiskUploadedFiles } from '../interfaces/files';

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
      req: UploadFileDto,
      files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface> {
      const uploadFile = files?.usersImport?.[0] ?? null;
      console.log('serwis is working');
      console.log({ uploadFile });

      return { files: 'ok' };
   }
}
