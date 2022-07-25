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
import {
   DeleteStudentResponse,
   UpdateStudentResponse,
} from 'src/interfaces/student';
import { Student } from './student.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('student')
export class StudentController {
   constructor(
      @Inject(StudentService) private studentService: StudentService,
   ) {}

   @Get('/:id')
   getStudent(@Param('id') id: string): Promise<Student> {
      return this.studentService.getOneStudent(id);
   }

   @Put('/:id')
   updateStudent(
      @Param('id') id: string,
      @Body() studentDetails: UpdateProfileDto,
   ): Promise<UpdateStudentResponse> {
      console.log('CONTROLER UPDATE WORKDS');

      return this.studentService.updateStudentDetails(id, studentDetails);
   }

   @Delete('/:id')
   deleteStudent(@Param('id') id: string): Promise<DeleteStudentResponse> {
      return this.studentService.deleteStudent(id);
   }
}
