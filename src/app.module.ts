import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrModule } from './hr/hr.module';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';

import dbConfiguration from './config/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { HrController } from './hr/hr.controller';
import { HrService } from './hr/hr.service';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         load: [dbConfiguration],
      }),
      TypeOrmModule.forRootAsync({
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => ({
            ...configService.get('database'),
         }),
      }),
      HrModule,
      StudentModule,
      AuthModule,
      UserModule,
      AdminModule,
      MailModule,
   ],
   controllers: [
      AppController,
      AuthController,
      StudentController,
      HrController,
      AdminController,
   ],
   providers: [AppService, AuthService, StudentService, HrService],
})
export class AppModule {}
