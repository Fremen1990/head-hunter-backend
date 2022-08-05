import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './controllers/hr.controller';
import { HrService } from './services/hr.service';
import { UserModule } from '../user/user.module';
import { StudentModule } from 'src/student/student.module';

@Module({
   imports: [forwardRef(() => UserModule), forwardRef(() => StudentModule)],
   controllers: [HrController],
   providers: [HrService],
   exports: [HrService],
})
export class HrModule {}
