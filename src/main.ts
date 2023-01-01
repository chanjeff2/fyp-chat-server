import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import admin from 'firebase-admin';
import * as crypto from 'crypto';
import encryptedServiceKey from './../serviceAccountKey.enc';

declare const module: any;

async function bootstrap() {
  // init app
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  // decrypt the serviceKey
  const algorithm = 'aes-128-cbc';
  const decipher = crypto.createDecipheriv(
    algorithm,
    configService.get<string>('SERVICE_ENCRYPTION_KEY') ?? '',
    configService.get<string>('SERVICE_ENCRYPTION_IV') ?? '',
  );
  let decrypted = decipher.update(encryptedServiceKey, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  const serviceAccount = JSON.parse(decrypted);

  try {
    // init firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (e) {
    // We skip the "already exists" message which is not an actual error when we're hot-reloading.
    if (!/already exists/u.test(e.message)) {
      console.error('Firebase admin initialization error', e.stack);
    }
  }

  await app.listen(configService.get<number>('PORT') ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
