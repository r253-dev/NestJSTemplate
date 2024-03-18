import { INestApplication } from '@nestjs/common';
import { patchNestJsSwagger } from 'nestjs-zod';
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
    })
    .addBearerAuth()
    .build();
  patchNestJsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./dist/swagger-spec.yaml', dump(document));
  SwaggerModule.setup('swagger', app, document);
}
