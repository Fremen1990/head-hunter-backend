import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './controllers/hr.controller';
import { HrService } from './services/hr.service';
import { UserModule } from '../user/user.module';

@Module({
   imports: [forwardRef(() => UserModule)],
   controllers: [HrController],
   providers: [HrService],
   exports: [HrService],
})
export class HrModule {}
