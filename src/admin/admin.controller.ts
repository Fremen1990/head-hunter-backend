import {
   Body,
   Controller,
   Get,
   Inject,
   Post,
   UploadedFiles,
   UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ImportUserResponse } from '../interfaces/user';
import { ImportUserDto } from './dto/import-user.dto';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../interfaces/upload';
// import { UploadFileDto } from './dto/upload-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from '../utils/storage';
import { MulterDiskUploadedFiles } from '../interfaces/files';
import { ImportHrDto } from './dto/import-hr.dto';
import { Student } from '../student/student.entity';
import { Hr } from '../hr/hr.entity';

@Controller('admin')
export class AdminController {
   constructor(@Inject(AdminService) private adminService: AdminService) {}

   // ---------------UPLOAD FILES WITH INTERCEPTOR!!-------------------------
   @Post('/upload')
   @UseInterceptors(
      FileFieldsInterceptor([{ name: 'usersImport', maxCount: 1 }], {
         storage: multerStorage(path.join(storageDir(), 'upload-file')),
      }),
   )
   async uploadFile(
      @UploadedFiles() files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface | UploadFileFailedInterface> {
      console.log('CONTROLER UPLOAD');
      return this.adminService.uploadFile(files);
   }

   // ---------------IMPORT UPLOADED USERS TO DATABASE!!-------------------------
   @Post('/import-students')
   async importStudents(
      @Body() newImportUsers: ImportUserDto[], // import dto converted to lower-case due to csv parsing and translation
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importStudents(newImportUsers);
   }

   // ---------------IMPORT UPLOADED HR TO DATABASE!!-------------------------
   @Post('/import-hr')
   importHr(
      @Body() newImportHr: ImportHrDto[], // import dto converted to lower-case due to csv parsing and translation
   ): Promise<ImportUserResponse> {
      return this.adminService.importHr(newImportHr);
   }

   // ---------------GET ALL STUDENTS FROM  DATABASE!!-------------------------
   @Get('/students/all')
   async getAllStudents(): Promise<Student[]> {
      return this.adminService.getAllStudents();
   }
   // ---------------GET ALL HR FROM  DATABASE!!-------------------------
   @Get('/hr/all')
   async getAllHr(): Promise<Hr[]> {
      return this.adminService.getAllHr();
   }
}
