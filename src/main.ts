import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

   await app.listen(3000);
}

bootstrap();
