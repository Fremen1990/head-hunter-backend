import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy],
   exports: [JwtStrategy],
})
export class AuthModule {}
