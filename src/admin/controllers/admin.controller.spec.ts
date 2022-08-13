import { Test, TestingModule } from '@nestjs/testing';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

import { AdminController } from './admin.controller';
import { AdminService } from '../services/admin.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Student } from '../../student/entities/student.entity';
import { getRandomArbitrary } from '../../utils/random-number';
import { faker } from '@faker-js/faker';
import { encrypt } from '../../utils/pwd-tools';
import nanoToken from '../../utils/nano-token';
import { Role } from '../../enums/role.enum';
import { StudentDto } from '../dto/student.dto';
import { HrDto } from '../dto/hr.dto';
import { Hr } from '../../hr/entities/hr.entity';

describe('AdminController', () => {
   let adminController: AdminController;
   let userService: UserService;
   let adminService: AdminService;

   const mockRequest = httpMocks.createRequest();

   mockRequest.user = new User();
   mockRequest.student = new Student();
   mockRequest.user.email = faker.internet.exampleEmail();
   mockRequest.user.pwd = encrypt(nanoToken());
   mockRequest.user.role = Role.STUDENT;
   mockRequest.student.courseCompletion = getRandomArbitrary(0, 5);
   mockRequest.student.courseEngagement = getRandomArbitrary(0, 5);
   mockRequest.student.projectDegree = getRandomArbitrary(0, 5);
   mockRequest.student.teamProjectDegree = getRandomArbitrary(0, 5);
   mockRequest.student.bonusProjectUrls = [
      faker.internet.domainName(),
      faker.internet.domainName(),
   ];
   mockRequest.hrUser = new User();
   mockRequest.hr = new Hr();
   mockRequest.hrUser.email = faker.internet.exampleEmail();
   mockRequest.hrUser.pwd = encrypt(nanoToken());
   mockRequest.hr.fullName = faker.name.firstName();
   mockRequest.hr.company = faker.company.companyName();
   mockRequest.hr.maxReservedStudents = getRandomArbitrary(1, 999);

   const mockCreateOneStudent = {
      email: mockRequest.user.email,
      pwd: mockRequest.user.pwd,
      role: mockRequest.user.role,
      courseCompletion: mockRequest.student.courseCompletion,
      courseEngagement: mockRequest.student.courseEngagement,
      projectDegree: mockRequest.student.projectDegree,
      teamProjectDegree: mockRequest.student.teamProjectDegree,
      bonusProjectUrls: mockRequest.student.bonusProjectUrls,
   };

   const mockCreateOneHr = {
      email: mockRequest.hrUser.email,
      pwd: mockRequest.hrUser.pwd,
      fullName: mockRequest.hr.fullName,
      company: mockRequest.hr.company,
      maxReservedStudents: mockRequest.hr.maxReservedStudents,
   };

   const mockAdminService = {
      createOneStudent: jest
         .fn()
         .mockImplementation((newStudent: StudentDto) => {
            return {
               ...newStudent,
            };
         }),
      createOneHr: jest.fn().mockImplementation((newHr: HrDto) => {
         return {
            ...newHr,
         };
      }),
   };
   const mockUserService = {};

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         controllers: [AdminController],
         providers: [
            AdminService,
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
         .overrideProvider(AdminService)
         .useValue(mockAdminService)
         .compile();

      adminController = moduleRef.get<AdminController>(AdminController);
      userService = moduleRef.get<UserService>(UserService);
      adminService = moduleRef.get<AdminService>(AdminService);
   });

   it('should be defined', () => {
      expect(adminController).toBeDefined();
   });

   it('should create one student', async () => {
      const addStudentTest = await adminController.addStudent(
         mockCreateOneStudent,
      );
      expect(addStudentTest).toEqual({
         ...mockCreateOneStudent,
      });
   });

   it('should create one HR', async () => {
      const addHrTest = await adminController.addHr(mockCreateOneHr);
      expect(addHrTest).toEqual({
         ...mockCreateOneHr,
      });
   });
});
