import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';
import { AdminAuthGuard } from 'auth/admin-auth/admin-auth.guard';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    ...getLoggerConfig(),
  });
  app.setGlobalPrefix('/v1');

  const adminAuthGuard = app.get(AdminAuthGuard);
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
