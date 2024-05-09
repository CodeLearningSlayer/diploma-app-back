import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors();

  const configService = app.get(ConfigService);
  const PORT = configService.get('port');
  const config = new DocumentBuilder()
    .setTitle('Social app')
    .setDescription('My app REST API documentation')
    .setVersion('1.0.0')
    .addTag('Social app')
    .build();

  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentation);

  await app.listen(PORT, () => console.log('Server started on port = ', PORT));
}
start();
