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
   ],
   controllers: [AppController, AuthController, StudentController],
   providers: [AppService, AuthService, StudentService],
})
export class AppModule {}
