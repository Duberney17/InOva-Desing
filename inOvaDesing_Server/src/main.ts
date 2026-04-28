import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — permite peticiones del frontend React (Vite)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true, // convierte tipos automáticamente
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('InOva Design API')
    .setDescription(
      'API REST para la plataforma InOva Design — Objetos Virtuales de Aprendizaje',
    )
    .setVersion('1.0')
    .addBearerAuth() // soporte para JWT en Swagger UI
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 InOva Design API corriendo en: http://localhost:${port}`);
  console.log(`📚 Swagger UI disponible en:      http://localhost:${port}/api`);
}
void bootstrap();
