import { Test, TestingModule } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

import { StudentController } from './student.controller';
import { StudentService } from '../services/student.service';
import { UserService } from '../../user/services/user.service';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { User } from '../../user/entities/user.entity';
import { Student } from '../entities/student.entity';

describe('StudentController', () => {
   let studentController: StudentController;
   let studentService: StudentService;
   let userService: UserService;

   const mockRequest = httpMocks.createRequest();
   mockRequest.user = new User();
   mockRequest.user.email = 'student@student.pl';
   mockRequest.student = new Student();

   const mockStudent: Student = mockRequest.student;

   const mockStudentService = {};
   const mockUserService = {};

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         controllers: [StudentController],
         providers: [
            StudentService,
            { provide: UserService, useValue: mockUserService },
            {
               provide: JwtGuard,
               useValue: jest.fn().mockImplementation(() => true),
            },
            {
               provide: RolesGuard,
               useValue: jest.fn().mockImplementation(() => true),
            },
         ],
      })
         .overrideProvider(StudentService)
         .useValue(mockStudentService)
         .compile();

      studentService = moduleRef.get<StudentService>(StudentService);
      userService = moduleRef.get<UserService>(UserService);
      studentController = moduleRef.get<StudentController>(StudentController);
   });

   it('should be defined', () => {
      expect(studentController).toBeDefined();
   });
});
