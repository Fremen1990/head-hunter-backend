import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { UserModule } from '../user/user.module';

@Module({
   imports: [forwardRef(() => UserModule)],
   controllers: [AdminController],
   providers: [AdminService],
   exports: [AdminService],
})
export class AdminModule {}
