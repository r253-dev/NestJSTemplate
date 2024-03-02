import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received.');
    // ここでデータベース接続の解除など、クリーンアップが必要な処理を行う
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received.');
    // ここでデータベース接続の解除など、クリーンアップが必要な処理を行う
    await app.close();
    process.exit(0);
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
