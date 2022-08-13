import { Test, TestingModule } from '@nestjs/testing';
import { HrController } from './hr.controller';
import { HrService } from '../services/hr.service';

describe('HrController', () => {
   let hrController: HrController;
   let hrService: HrService;

   const mockHrService = {};

   beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         controllers: [HrController],
         providers: [HrService],
      })
         .overrideProvider(hrService)
         .useValue(mockHrService)
         .compile();

      hrController = moduleRef.get<HrController>(HrController);
      hrService = moduleRef.get<HrService>(HrService);
   });

   it('should be defined', () => {
      expect(hrController).toBeDefined();
   });
});
