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

   // const mockFeedStudent: any = {
   //    id: '9ff1470e-c693-46c4-a91f-98b873340b59',
   //    email: 'student@test.com',
   //    encryptedPwd:
   //       '2d0cdeb7c2dbfb845dba3b113e695a1397f7bd3899860c0ac3adbb3323a58b52',
   //    role: 'student',
   //    currentSessionToken: 'dbff8e15-242e-44fa-a8f8-8e1580f9b20b',
   //    registrationToken: null,
   //    resetPasswordToken: null,
   //    active: true,
   //    created_at: '2022-08-12T20:38:07.348Z',
   //    updated_at: '2022-08-12T21:27:15.000Z',
   //    student: {
   //       studentId: '9ff1470e-c693-46c4-a91f-98b873340b59',
   //       courseCompletion: '4.23',
   //       courseEngagement: '2.13',
   //       projectDegree: '3.75',
   //       teamProjectDegree: '1.50',
   //       bonusProjectUrls: [
   //          'https://github.com/Fremen1990/head-hunter-frontend',
   //          'https://head-hunter-frontend.vercel.app/login',
   //          'https://github.com/Fremen1990/head-hunter-backend',
   //       ],
   //       studentStatus: 'employed',
   //       tel: '',
   //       firstName: '',
   //       lastName: '',
   //       githubUserName: '',
   //       portfolioUrls: [],
   //       projectUrls: [],
   //       bio: '',
   //       expectedTypeOfWork: 'any',
   //       targetWorkCity: '',
   //       expectedContractType: 'any',
   //       expectedSalary: '',
   //       canTakeApprenticeship: 'no',
   //       monthsOfCommercialExp: 0,
   //       education: '',
   //       workExperience: '',
   //       courses: '',
   //       firstLogin: true,
   //       created_at: '2022-08-12T20:38:07.325Z',
   //       updated_at: '2022-08-12T21:11:25.000Z',
   //    },
   // };

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
