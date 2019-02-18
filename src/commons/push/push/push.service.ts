import { Injectable } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';

@Injectable()
export class PushService {
    private client;

    constructor() {
        this.client = new OneSignal.Client({
            userAuthKey: 'NWI0YjAwMTQtYzZmZi00OTkzLWJmMGUtNWEzYTljYWM4YTY0',
            // note that "app" must have "appAuthKey" and "appId" keys
            app: { appAuthKey: 'OWZjNzYyZWMtYTQzNi00ODc4LWE1MTQtZGU0ODM2ZTgwMWJj', appId: '4a6a9240-4cb2-400d-8fea-a9647e951581' },
        });
    }

    async sendMessage(userId: string, title: string, body: string, data: any) {
        const firstNotification = new OneSignal.Notification({
            headings: {
                en: title,
            },
            contents: {
                en: body,
            },
            data, // Could be any object with data, like {restID: 34} for example
            include_player_ids: [userId],
        });
        this.client.sendNotification(firstNotification, (err, httpResponse, data) => {
            if (err) {
                //console.log(err);
            } else {
                //console.log(data, httpResponse.statusCode);
            }
         });
    }
}
