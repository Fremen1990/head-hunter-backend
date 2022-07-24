import {
   Body,
   Controller,
   Inject,
   Post,
   UploadedFiles,
   UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ImportUserResponse } from '../interfaces/user';
import { ImportUserDto } from './dto/import-user.dto';
import { UploadFileResponseInterface } from '../interfaces/upload';
// import { UploadFileDto } from './dto/upload-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from '../utils/storage';
import { MulterDiskUploadedFiles } from '../interfaces/files';

@Controller('admin')
export class AdminController {
   constructor(@Inject(AdminService) private adminService: AdminService) {}

   // ---------------IMPORT UPLOADED USERS DO DATABASE!!-------------------------
   @Post('/import-users')
   importUsers(
      @Body() newImportUsers: ImportUserDto[], // import dto converted to lower-case due to csv parsing and translation
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importUsers(newImportUsers);
   }

   // ---------------UPLOAD FILES WITH INTERCEPTOR!!-------------------------
   @Post('/upload')
   @UseInterceptors(
      FileFieldsInterceptor([{ name: 'usersImport', maxCount: 1 }], {
         storage: multerStorage(path.join(storageDir(), 'students-file')),
      }),
   )
   async uploadFile(
      @UploadedFiles() files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface> {
      console.log('CONTROLER UPLOAD');
      return this.adminService.uploadFile(files);
   }
}
