import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { HrModule } from '../hr/hr.module';

@Module({
   imports: [forwardRef(() => HrModule)],
   providers: [CronService],
   exports: [CronService],
})
export class CronModule {}
