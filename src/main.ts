import Logger from './shared/utils/Logger'; // Default import
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/middlewares/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for API routes
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  // Start the server
  const port = process.env.PORT || 5000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();