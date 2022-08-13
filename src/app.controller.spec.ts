import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
   let appController: AppController;
   let appService: AppService;

   const mockAppService = {
      getHello: jest.fn().mockImplementation(() => {
         return {
            apiName: 'MegaK Head Hunter API',
            message:
               'Welcome to our api which is gathering students and HRs together to make them both happy :)',
            status: 'OK',
         };
      }),
   };

   beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
         controllers: [AppController],
         providers: [AppService],
      })
         .overrideProvider(AppService)
         .useValue(mockAppService)
         .compile();

      appController = app.get<AppController>(AppController);
      appService = app.get<AppService>(AppService);
   });

   describe('root', () => {
      it('should be defined', async () => {
         await expect(appController).toBeDefined();
      });

      it('should return API name, message and status', () => {
         expect(appController.apiStatus()).toEqual({
            apiName: 'MegaK Head Hunter API',
            message:
               'Welcome to our api which is gathering students and HRs together to make them both happy :)',
            status: 'OK',
         });
      });
   });
});
