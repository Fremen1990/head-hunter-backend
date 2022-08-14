import { Test, TestingModule } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');
import { UserService } from '../../user/services/user.service';
import { AdminService } from './admin.service';
import { MailService } from '../../mail/mail.service';
import { AdminController } from '../controllers/admin.controller';

describe('AdminService', () => {
   let adminService: AdminService;
   let mailService: MailService;
   let userService: UserService;

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         providers: [UserService, MailService, AdminService],
         controllers: [AdminController],
      }).compile();

      const mockRequest = httpMocks.createRequest();

      mailService = moduleRef.get<MailService>(MailService);
      userService = moduleRef.get<UserService>(UserService);
      adminService = moduleRef.get<AdminService>(AdminService);
   });

   it('should be defined', () => {
      expect(adminService).toBeDefined();
   });
});
