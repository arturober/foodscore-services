import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use('/img', express.static('img'));
  app.use(express.json({ limit: '10mb' }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  try {
    const serviceAccount =
      await require('../firebase/dwec2021-firebase-adminsdk-103so-9b60f28cf5.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://dwec2019.firebaseio.com',
    });
  } catch (e) {}

  await app.listen(3000);
}
bootstrap();
