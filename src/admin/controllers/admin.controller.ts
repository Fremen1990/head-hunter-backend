import {
   Body,
   Controller,
   Get,
   Inject,
   Param,
   Post,
   UploadedFiles,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import {
   createOneUserResponse,
   ImportUserResponse,
} from '../../interfaces/user';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../../interfaces/upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from '../../utils/storage';
import { MulterDiskUploadedFiles } from '../../interfaces/files';
import { HrDto } from '../dto/hr.dto';
import { Student } from '../../student/entities/student.entity';
import { Hr } from '../../hr/entities/hr.entity';
import { StudentDto } from '../dto/student.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ImportRandomStudentsResponse } from '../../interfaces/student';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminController {
   constructor(
      @Inject(AdminService) private adminService: AdminService,
      @Inject(UserService) private userService: UserService,
   ) {}

   // ---------------ADD-ONE-STUDENT-------------------------
   @Post('/add-student')
   async addStudent(
      @Body() newStudent: StudentDto,
   ): Promise<createOneUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.createOneStudent(newStudent);
   }

   // ------------------ADD-ONE-HR------------------------------
   @Post('/add-hr')
   async addHr(@Body() newHr: HrDto): Promise<createOneUserResponse> {
      return this.adminService.createOneHr(newHr);
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

   @Get('/user/all')
   getAll(): Promise<User[]> {
      return this.userService.getAllUsers();
   }

   @Get('/user/:id')
   getOne(@Param('id') id: string): Promise<User> {
      return this.userService.getOneUser(id);
   }

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
      @Body() newImportUsers: StudentDto[],
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importStudents(newImportUsers);
   }

   // ---------------IMPORT UPLOADED HR TO DATABASE!!-------------------------
   @Post('/import-hr')
   importHr(@Body() newImportHr: HrDto[]): Promise<ImportUserResponse> {
      return this.adminService.importHr(newImportHr);
   }

   // ---------------SEND REGISTRATION EMAIL -------------------------
   @Post('/students/send-registration-email')
   async sendRegistrationEmailToStudents(): Promise<any> {
      return this.adminService.mailUsers();
   }
   // ---------------GENERATE RANDOM STUDENTS TO DB-------------------------
   @Post('import-students/random100')
   async importRandomStudents(): Promise<ImportRandomStudentsResponse> {
      return this.adminService.importRandomFakeStudentsData();
   }
}
