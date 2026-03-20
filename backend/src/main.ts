import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('todo');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
