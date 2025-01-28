import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parsing middleware
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Adjust the frontend URL
    credentials: true, // Allow cookies to be sent
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT || 4000); // Listen on port
}

bootstrap();
