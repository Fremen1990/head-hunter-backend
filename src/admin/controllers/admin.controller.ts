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
import {
   ApiBody,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { createOneUserResponse, ImportUserResponse } from '../../types/user';
import {
   UploadFileFailedInterface,
   UploadFileResponseInterface,
} from '../../types/upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from '../../utils/storage';
import { MulterDiskUploadedFiles } from '../../types/files';
import { HrDto } from '../dto/hr.dto';
import { Student } from '../../student/entities/student.entity';
import { Hr } from '../../hr/entities/hr.entity';
import { StudentDto } from '../dto/student.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ImportRandomStudentsResponse } from '../../types';

@ApiTags('Admin')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminController {
   constructor(
      @Inject(AdminService) private adminService: AdminService,
      @Inject(UserService) private userService: UserService,
   ) {}

   //============================ADD ONE STUDENT================================
   @ApiCreatedResponse({
      description: 'One student has been created and returned student object',
   })
   @ApiBody({ type: StudentDto })
   @Post('/add-student')
   @ApiCreatedResponse({
      description: 'Creation new student by Admin',
   })
   async addStudent(
      @Body() newStudent: StudentDto,
   ): Promise<createOneUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.createOneStudent(newStudent);
   }

   //============================ADD ONE HR================================
   @ApiCreatedResponse({
      description: 'One HR has been created and returned student object',
   })
   @ApiBody({ type: HrDto })
   @Post('/add-hr')
   async addHr(@Body() newHr: HrDto): Promise<createOneUserResponse> {
      return this.adminService.createOneHr(newHr);
   }

   //============================GET ALL STUDENTS================================
   @ApiOkResponse({ description: 'Displayed all Students from DB' })
   @Get('/students/all')
   async getAllStudents(): Promise<Student[]> {
      return this.adminService.getAllStudents();
   }
   //============================GET ALL HR================================
   @ApiOkResponse({ description: 'Displayed All HR from DB' })
   @Get('/hr/all')
   async getAllHr(): Promise<Hr[]> {
      return this.adminService.getAllHr();
   }

   //============================GET ALL USERS================================
   @ApiOkResponse({ description: 'Displayed All User from DB' })
   @Get('/user/all')
   getAll(): Promise<User[]> {
      return this.userService.getAllUsers();
   }

   //============================GET ONE USERS================================
   @ApiOkResponse({ description: 'Displayed one  User from DB' })
   @Get('/user/:id')
   getOne(@Param('id') id: string): Promise<User> {
      return this.userService.getOneUser(id);
   }

   //============================UPLOAD FILE================================
   @ApiCreatedResponse({ description: 'Array with data from the file' })
   @ApiNotFoundResponse({ description: 'No file has been uploaded' })
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

   //====================IMPORT UPLOADED STUDENTS FROM FILE=====================
   @ApiCreatedResponse({
      description: 'Array students from the file uploaded to the DB',
   })
   @ApiBody({ type: StudentDto })
   @Post('/import-students')
   async importStudents(
      @Body() newImportUsers: StudentDto[],
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importStudents(newImportUsers);
   }

   //=========================IMPORT UPLOADED HR FROM FILE=======================
   @ApiCreatedResponse({
      description: 'Array HR from the file uploaded to the DB',
   })
   @ApiBody({ type: HrDto })
   @Post('/import-hr')
   importHr(@Body() newImportHr: HrDto[]): Promise<ImportUserResponse> {
      return this.adminService.importHr(newImportHr);
   }

   //=========================SEND REGISTRATION EMAIL============================
   @Post('/students/send-registration-email')
   async sendRegistrationEmailToStudents(): Promise<any> {
      return this.adminService.mailUsers();
   }
   //=======================GENERATE RANDOM 100 STUDENTS=======================
   @ApiCreatedResponse({
      description: 'Generate x100 random students with fulfilled data ',
   })
   @Post('import-students/random100')
   async importRandomStudents(): Promise<ImportRandomStudentsResponse> {
      return this.adminService.importRandomFakeStudentsData();
   }
}
