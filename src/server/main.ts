import { NestFactory } from '@nestjs/core';

import { AppModule } from 'app.module';
import { hostSwagger } from 'libs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1');

  if (process.env.IS_SWAGGER_ENABLED === 'true') {
    hostSwagger(app);
  }

  app.enableCors({
    origin: [process.env.SERVICE_SITE_URL!],
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
