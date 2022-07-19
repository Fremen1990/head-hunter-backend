import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrModule } from './hr/hr.module';

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
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
