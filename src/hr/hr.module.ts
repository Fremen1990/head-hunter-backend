import { Module } from '@nestjs/common';
import { HrController } from './controllers/hr.controller';
import { HrService } from './services/hr.service';

@Module({
   controllers: [HrController],
   providers: [HrService],
   exports: [HrService],
})
export class HrModule {}
