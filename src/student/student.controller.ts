import {
   Body,
   Controller,
   Delete,
   Get,
   Inject,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { RegisterDto } from './dto/register.dto';
import {
   DeleteStudentResponse,
   RegisterStudentResponse,
   UpdateStudentResponse,
} from 'src/interfaces/student';
import { Student } from './student.entity';
import { User } from '../user/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('student')
export class StudentController {
   constructor(
      @Inject(StudentService) private studentService: StudentService,
   ) {}

   // To chyba powinno tu zostać, bo to endpoint dla studenta i on powinien sie rejestrowac
   @Post('/register-student/:userId/:registerTokenId')
   register(
      @Body() userPwd: RegisterDto,
      @Param('userId') userId: string,
      @Param('registerTokenId') registerTokenId: string,
   ): Promise<RegisterStudentResponse> {
      return this.studentService.register(userPwd, userId, registerTokenId);
   }

   @Get('/:email')
   getStudent(@Param('email') studentEmail: string): Promise<Student> {
      return this.studentService.getOneStudent(studentEmail);
   }

   @Put('/:email')
   updateStudent(
      @Param('email') studentEmail: string,
      @Body() studentDetails: UpdateProfileDto,
   ): Promise<UpdateStudentResponse> {
      console.log('CONTROLER UPDATE WORKDS');

      return this.studentService.updateStudentDetails(
         studentEmail,
         studentDetails,
      );
   }

   @Delete('/:email')
   deleteStudent(
      @Param('email') studentEmail: string,
   ): Promise<DeleteStudentResponse> {
      return this.studentService.deleteStudent(studentEmail);
   }
}
