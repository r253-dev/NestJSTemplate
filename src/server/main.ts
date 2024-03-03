import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.SERVICE_SITE_URL!],
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
