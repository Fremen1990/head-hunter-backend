import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrModule } from './hr/hr.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';

@Module({
   imports: [
      TypeOrmModule.forRoot({
         type: 'mysql',
         host: 'localhost',
         port: 3306,
         username: 'root',
         password: '',
         database: 'mysql-head-hunter-db',
         entities: ['dist/**/**.entity{.ts,.js}'],
         logging: true,
         synchronize: true,
      }),
      HrModule,
   ],
   controllers: [AppController, AuthController, StudentController],
   providers: [AppService, AuthService, StudentService],
})
export class AppModule {}
