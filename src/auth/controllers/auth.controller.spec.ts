import { Test, TestingModule } from '@nestjs/testing';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
   let authController: AuthController;
   let authService: AuthService;

   const mockRequest = httpMocks.createRequest();
   mockRequest.email = 'test@login.com';
   mockRequest.pwd = 'testLoginPwd123';

   const mockLogin = {
      email: mockRequest.email,
      pwd: mockRequest.pwd,
   };

   const mockAuthService = {
      res: {},

      login: jest.fn().mockImplementation((req, res) => {
         if (req.email === mockLogin.email && req.pwd === mockLogin.pwd) {
            return {
               id: '1',
               email: mockRequest.email,
               role: 'student',
               token: 'sdbvst35435',
               active: 'active',
            };
         }
      }),

      logout: jest.fn().mockImplementation((req, res) => {
         if (req === mockRequest.email) {
            return { ok: true };
         }
      }),
   };

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [AuthService],
      })
         .overrideProvider(AuthService)
         .useValue(mockAuthService)
         .compile();

      authService = moduleRef.get<AuthService>(AuthService);
      authController = moduleRef.get<AuthController>(AuthController);
   });

   it('should be defined', async () => {
      await expect(authController).toBeDefined();
   });

   it('should login user with response user', async () => {
      const res = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const loginTest = await authController.login(mockLogin, res);
      await expect(loginTest).toEqual({
         id: '1',
         email: mockRequest.email,
         role: 'student',
         token: 'sdbvst35435',
         active: 'active',
      });
   });

   it("should logout user with return 'ok:true'", async () => {
      const res = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const logoutTest = await authController.logout('test@login.com', res);
      await expect(logoutTest).toEqual({ ok: true });
   });
});
