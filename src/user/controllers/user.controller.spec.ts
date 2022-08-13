import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
   let userController: UserController;
   let userService: UserService;

   const mockUserService = {};

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         controllers: [UserController],
         providers: [UserService],
      })
         .overrideProvider(UserService)
         .useValue(mockUserService)
         .compile();

      userController = moduleRef.get<UserController>(UserController);
      userService = moduleRef.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(userController).toBeDefined();
   });
});
