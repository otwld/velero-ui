import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { AppModule } from './app/app.module';
import passport from 'passport';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useLogger(app.get(AppLogger));
  app.enableCors();
  app.use(passport.initialize());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
