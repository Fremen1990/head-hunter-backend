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
import { UploadFileDto } from './dto/upload-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { MulterDiskUploadedFiles } from '../interfaces/files';

@Controller('admin')
export class AdminController {
   constructor(@Inject(AdminService) private adminService: AdminService) {}

   @Post('/import-users')
   importUsers(
      @Body() newImportUsers: ImportUserDto,
      @UploadedFiles() files: MulterDiskUploadedFiles,
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importUsersCsv(newImportUsers, files);
   }

   // ---------------UPLOAD FILES WITH INTERCEPTOR!!-------------------------
   @Post('/upload')
   @UseInterceptors(
      FileFieldsInterceptor([{ name: 'usersImport', maxCount: 1 }], {
         dest: path.join(storageDir(), 'students-file'),
      }),
   )
   async uploadFile(
      @Body() req: UploadFileDto,
      @UploadedFiles() files: MulterDiskUploadedFiles,
   ): Promise<UploadFileResponseInterface> {
      console.log('CONTROLER UPLOAD');
      return this.adminService.uploadFile(req, files);
   }
}
