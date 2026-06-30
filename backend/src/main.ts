import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Prefijo Global para el Versioando de la API
  app.setGlobalPrefix('api/v1');

  //Class-Validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de la Especificación de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Silverback <3')
    .setDescription(
      'Especificación técnica de los endpoints para auditoría, gestión documental y reportes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  //Habilitación de la interfaz interactiva en http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  //Exportación automática de OpenAPI para Postman
  //Generación de archivo estático en la raíz del backend para ser compartido o importado
  const outputPath = path.resolve(process.cwd(), 'openapi-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
