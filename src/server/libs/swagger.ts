import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { dump } from 'js-yaml';

export function hostSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Template API')
    .setDescription('Template API')
    .setVersion('0.1.0')
    .addGlobalParameters({
      name: 'X-Requested-With',
      in: 'header',
      required: false,
      // 本来はtrueにすべきだが、クライアント自動生成時に入力を強制されて面倒なのでfalseにしている。
      // 現状はaxiosのデフォルト値を使っているため、リクエストごとに明示的に指定する必要が無い。
    })
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./dist/swagger-spec.yaml', dump(document));
  SwaggerModule.setup('swagger', app, document);
}
