import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AdminJwtAuthGuard } from 'guards/admin-jwt-auth.guard';
import { AllExceptionsFilter } from 'share/filters/exception.filter';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    ...getLoggerConfig(),
  });
  app.use(helmet());

  app.setGlobalPrefix('/v1');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const adminAuthGuard = app.get(AdminJwtAuthGuard);
  app.useGlobalGuards(adminAuthGuard);

  app.enableCors({
    origin: [process.env.SERVICE_SITE_URL!],
  });

  return app;
}

function getLoggerConfig() {
  const logger = process.env.APP_LOGGER;
  if (logger === undefined) {
    return {};
  }
  if (logger === 'false') {
    return {
      logger: false,
    } as const;
  }
  return {};
}
