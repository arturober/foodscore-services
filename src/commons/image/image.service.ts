import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as download from 'image-downloader';

@Injectable()
export class ImageService {
  saveImage(dir: string, photo: string): Promise<string> {
    const data = photo.split(',')[1] || photo;
    const file = `${Date.now()}.jpg`;
    return new Promise((resolve, reject) => {
      const filePath = path.join('img', dir, file);
      fs.writeFile(filePath, data, { encoding: 'base64' }, (err) => {
        if (err) {
          reject(err);
        }
        resolve(`img/${dir}/${file}`);
      });
    });
  }

  saveImageBinary(dir: string, img: BinaryType): Promise<string> {
    const file = `${Date.now()}.jpg`;
    return new Promise((resolve, reject) => {
      const filePath = path.join('img', dir, file);
      fs.writeFile(filePath, img, 'binary', (err) => {
        if (err) {
          reject(err);
        }
        resolve(`img/${dir}/${file}`);
      });
    });
  }

  async downloadImage(dir: string, url: string): Promise<string> {
    const file = `${Date.now()}.jpg`;
    const filePath = path.join('img', dir, file);
    await download.image({
      url,
      dest: filePath,
    });
    return `img/${dir}/${file}`;
  }

  removeImage(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
