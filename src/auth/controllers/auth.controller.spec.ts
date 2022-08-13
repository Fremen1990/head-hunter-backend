import { Test, TestingModule } from '@nestjs/testing';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
   let authController: AuthController;
   let authService: AuthService;
   const mockAuthService = {};

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

   it('should be defined', () => {
      expect(authController).toBeDefined();
   });
});
