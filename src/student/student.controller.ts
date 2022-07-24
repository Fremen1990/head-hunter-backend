import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentResponse } from 'src/interfaces/student';
import { Student } from './student.entity';
import { User } from '../user/user.entity';

@Controller('student')
export class StudentController {
   constructor(
      @Inject(StudentService) private studentService: StudentService,
   ) {}

   @Get('/')
   getAllStudents(): Promise<Student[]> {
      return this.studentService.getAllStudents();
   }

   @Get('/:id')
   getStudent(@Param('studentId') studentId: string): Promise<User> {
      return this.studentService.getOneStudent(studentId);
   }

   // przeniesc do modulu admin
   @Post('/register-student/:userId/:registerTokenId')
   register(
      @Body() userPwd: RegisterDto,
      @Param('userId') userId: string,
      @Param('registerTokenId') registerTokenId: string,
   ): Promise<RegisterStudentResponse> {
      return this.studentService.register(userPwd, userId, registerTokenId);
   }
}
