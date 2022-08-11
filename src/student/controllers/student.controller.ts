import {
   Body,
   Controller,
   Delete,
   Get,
   Inject,
   Param,
   Put,
   UseGuards,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import {
   DeleteStudentResponse,
   UpdateStudentResponse,
} from 'src/types/student';
import { Student } from '../entities/student.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import {
   ApiBody,
   ApiCookieAuth,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Student')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Roles(Role.ADMIN, Role.STUDENT)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('student')
export class StudentController {
   constructor(
      @Inject(StudentService) private studentService: StudentService,
   ) {}

   //============================GET ONE STUDENT================================
   @ApiOkResponse({
      description: 'User table results together with Student table relation',
   })
   @Get('/:id')
   getStudent(@Param('id') id: string): Promise<Student> {
      return this.studentService.getOneStudent(id);
   }
   //============================GET ALL STUDENT================================
   @ApiOkResponse({
      description:
         'Users Array results from user table together with Student table relation',
   })
   @Get('/')
   getAll(): Promise<any> {
      return this.studentService.getAllStudents();
   }

   //============================UPDATE STUDENT PROFILE================================
   @ApiOkResponse({
      description: 'Student details updated',
   })
   @ApiBody({ type: UpdateProfileDto })
   @Put('/:id')
   updateStudent(
      @Param('id') id: string,
      @Body() studentDetails: any,
      // UpdateProfileDto, // TODO - compare and clean up with front-end
   ): Promise<UpdateStudentResponse> {
      console.log('CONTROLER UPDATE WORKDS');

      return this.studentService.updateStudentDetails(id, studentDetails);
   }

   //============================UPDATE STUDENT PROFILE================================
   @ApiOkResponse({
      description: 'Student deleted',
   })
   @Delete('/:id')
   deleteStudent(@Param('id') id: string): Promise<DeleteStudentResponse> {
      return this.studentService.deleteStudent(id);
   }
}
