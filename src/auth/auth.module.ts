import { forwardRef, Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
   imports: [forwardRef(() => MailModule)],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy],
   exports: [JwtStrategy],
})
export class AuthModule {}
