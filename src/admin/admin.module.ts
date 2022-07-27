import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MailModule } from '../mail/mail.module';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
   imports: [forwardRef(() => MailModule), forwardRef(() => UserModule)],
   controllers: [AdminController],
   providers: [AdminService],
   exports: [AdminService],
})
export class AdminModule {}
