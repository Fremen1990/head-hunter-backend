import { forwardRef, Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { UserModule } from '../user/user.module';

@Module({
   imports: [forwardRef(() => UserModule)],
   controllers: [StudentController],
   providers: [StudentService],
   exports: [StudentService],
})
export class StudentModule {}
