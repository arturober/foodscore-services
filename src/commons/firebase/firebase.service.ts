import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sendMessage(
    token: string,
    title: string,
    body: string,
    data: any,
  ): Promise<string> {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    try {
      const resp = await admin.messaging().send(message);
      return resp;
    } catch (e) {
      return null;
    }
  }
}
