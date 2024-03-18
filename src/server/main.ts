import { hostSwagger } from 'libs/swagger';
import { createApp } from 'app';

async function bootstrap() {
  const app = await createApp();

  if (process.env.IS_SWAGGER_ENABLED === 'true') {
    hostSwagger(app);
  }
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
