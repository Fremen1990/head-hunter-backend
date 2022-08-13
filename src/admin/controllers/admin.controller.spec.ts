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
   const mockGetAllStudents = [
      {
         studentId: '03ac5adb-0705-41ba-9201-7c88314747c7',
         courseCompletion: '2.66',
         courseEngagement: '3.23',
         projectDegree: '1.70',
         teamProjectDegree: '4.67',
         bonusProjectUrls: ['oblong-quilt.org', 'sneaky-nobody.org'],
         studentStatus: 'available',
         tel: '(233) 873-2810',
         firstName: 'Florine',
         lastName: 'Reynolds',
         githubUserName: 'Rashad73',
         portfolioUrls: ['repulsive-loop.net', 'watery-salute.info'],
         projectUrls: ['irresponsible-interpretation.name', 'blind-ballot.com'],
         bio: 'Corporate',
         expectedTypeOfWork: 'any',
         targetWorkCity: 'La Mirada',
         expectedContractType: 'any',
         expectedSalary: '6745.',
         canTakeApprenticeship: 'no',
         monthsOfCommercialExp: 2,
         education: 'Donskoy',
         workExperience: 'Ford 1',
         courses: 'generate back-end system',
         firstLogin: true,
         created_at: '2022-08-11T10:24:13.734Z',
         updated_at: '2022-08-11T10:24:13.734Z',
      },
      {
         studentId: '066c4d3f-a526-4db5-9447-6dfbc6e3098e',
         courseCompletion: '0.30',
         courseEngagement: '4.74',
         projectDegree: '2.56',
         teamProjectDegree: '4.51',
         bonusProjectUrls: ['sympathetic-carabao.biz', 'past-pizza.org'],
         studentStatus: 'employed',
         tel: '890.402.3570',
         firstName: 'Major',
         lastName: 'Hodkiewicz',
         githubUserName: 'Dejon9',
         portfolioUrls: ['vast-hardship.name', 'dapper-agony.info'],
         projectUrls: ['wonderful-codpiece.net', 'fantastic-peasant.info'],
         bio: 'Legacy',
         expectedTypeOfWork: 'any',
         targetWorkCity: 'Manteca',
         expectedContractType: 'any',
         expectedSalary: '30409',
         canTakeApprenticeship: 'no',
         monthsOfCommercialExp: 18,
         education: 'Turkish Angora',
         workExperience: 'Bentley Volt',
         courses: 'connect haptic driver',
         firstLogin: true,
         created_at: '2022-08-11T10:24:13.488Z',
         updated_at: '2022-08-11T10:33:43.000Z',
      },
   ];
   const mockGetAllHr = [
      {
         hrId: '6328a49e-a1b4-4f37-a21b-c6f32cea4793',
         fullName: 'Batłomiej Borowczyk',
         company: 'Samuraj Programowania',
         maxReservedStudents: 0,
      },
      {
         hrId: '6737deb9-f886-4dfc-a6e6-a9446fc50226',
         fullName: 'MEGAK TEAM',
         company: 'Samuraje Polscy SA',
         maxReservedStudents: 666,
      },
      {
         hrId: '0474b2f5-7b4f-4566-af99-86421aa296b7',
         fullName: 'Jakub Król',
         company: 'IT Focus',
         maxReservedStudents: 0,
      },
   ];
   const mockGetAllUsers = [
      {
         id: '03ac5adb-0705-41ba-9201-7c88314747c7',
         email: 'Emmitt78@example.net',
         encryptedPwd:
            '99d96a8ef88a7a9e9516a00df6f7f91df838e5ba3f4e0b3c3767a6ba4372dba33c27578714165b01dc69032bf1018690',
         role: 'student',
         currentSessionToken: null,
         registrationToken: '9jzqq7w9yssf91r60ezx6sru2',
         resetPasswordToken: null,
         active: true,
         created_at: '2022-08-11T10:24:13.739Z',
         updated_at: '2022-08-11T10:24:13.739Z',
      },
      {
         id: '0474b2f5-7b4f-4566-af99-86421aa296b7',
         email: 'jakubkrol@megak.pl',
         encryptedPwd:
            '5837ac8f7674970bdffb330e26002c4fd02c0d075c372eaabb990f26983fdf5780ab571540eb7846579a810d1f5bf74a',
         role: 'hr',
         currentSessionToken: null,
         registrationToken: '00vg3u63simybmnja8cp7309h',
         resetPasswordToken: null,
         active: false,
         created_at: '2022-08-11T10:23:12.591Z',
         updated_at: '2022-08-11T10:23:12.591Z',
      },
      {
         id: '066c4d3f-a526-4db5-9447-6dfbc6e3098e',
         email: 'Kobe_Effertz85@example.net',
         encryptedPwd:
            '134aa0838084f59a75f61e0e35bf133d26d964272003c2e2cfe2f3d675ab043acbf5ae119383f32d36082e0d6def048f',
         role: 'student',
         currentSessionToken: null,
         registrationToken: 'ro7sfgsqkf4eut1tm6pxts39f',
         resetPasswordToken: null,
         active: true,
         created_at: '2022-08-11T10:24:13.492Z',
         updated_at: '2022-08-11T10:24:13.492Z',
      },
   ];

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

      getAllStudents: jest.fn().mockImplementation(() => {
         return mockGetAllStudents;
      }),

      getAllHr: jest.fn().mockImplementation(() => {
         return mockGetAllHr;
      }),
   };
   const mockUserService = {
      getAllUsers: jest.fn().mockImplementation(() => {
         return mockGetAllUsers;
      }),
   };

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

   it('should get all students', async () => {
      const getAllStudentsTest = await adminController.getAllStudents();
      await expect(getAllStudentsTest).toEqual(mockGetAllStudents);
   });

   it('should get all HR', async () => {
      const getAllHrTest = await adminController.getAllHr();
      await expect(getAllHrTest).toEqual(mockGetAllHr);
   });

   it('should get all Users', async () => {
      const getAllUsersTest = await adminController.getAll();
      await expect(getAllUsersTest).toEqual(mockGetAllUsers);
   });

   //   TODO GET ONE USER ADMIN CONTROLLER LINE 101
});
