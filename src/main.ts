import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   const config = new DocumentBuilder()
      .setTitle('MegaK Head Hunter')
      .setDescription('The Head Hunter API for HR recruiters and developers')
      .setVersion('1.0')
      .addTag('developer')
      .build();

   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);

   app.useGlobalPipes(
      new ValidationPipe({
         disableErrorMessages: true,

         whitelist: true,
         forbidNonWhitelisted: true,

         transform: true,
         transformOptions: {
            enableImplicitConversion: true,
         },
      }),
   );

   app.use(cookieParser());

   app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
   });

   await app.listen(8000);
}

bootstrap();
