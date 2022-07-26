import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrModule } from './hr/hr.module';

import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { StudentService } from './student/services/student.service';
import { StudentController } from './student/controllers/student.controller';

import dbConfiguration from './config/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { HrController } from './hr/controllers/hr.controller';
import { HrService } from './hr/services/hr.service';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/controllers/admin.controller';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';

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
      ScheduleModule.forRoot(),
      HrModule,
      StudentModule,
      AuthModule,
      UserModule,
      AdminModule,
      MailModule,
      CronModule,
   ],
   controllers: [
      AppController,
      AuthController,
      StudentController,
      HrController,
      AdminController,
   ],
   providers: [AppService, AuthService, StudentService, HrService, CronService],
})
export class AppModule {}
