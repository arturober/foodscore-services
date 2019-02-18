import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as download from 'image-downloader';

@Injectable()
export class ImageService {
    saveImage(dir: string, photo: string): Promise<string> {
        const data = photo.split(',')[1] || photo;
        return new Promise((resolve, reject) => {
          const filePath = path.join('img', dir, `${Date.now()}.jpg`);
          fs.writeFile(filePath, data, {encoding: 'base64'}, (err) => {
            if (err) reject(err);
            resolve(filePath);
          });
        });
    }

    async downloadImage(dir: string, url: string): Promise<string> {
      const filePath = path.join('img', dir, `${Date.now()}.jpg`);
      await download.image({
        url,
        dest: filePath,
      });
      return filePath;
    }
}
