import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
         // logging: true,
         synchronize: true,
      }),
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
