import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { REQUEST } from '@nestjs/core';
import { FirebaseApp } from 'firebase/app';
import { Request } from 'express';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject('FIREBASE_APP')
    private firebaseApp: FirebaseApp,
  ) {}
  async transform(image: Express.Multer.File): Promise<string> {
    const query = this.request.query;
    const { top, left, width, height } = query;
    const isExtractNeed = top && left && width && height;

    const originalName = path.parse(image.originalname).name;
    const filename =
      Date.now() + '-' + originalName.replaceAll(' ', '') + '.webp';

    const filePath = path.resolve(__dirname, '..', 'static');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + filename);

    if (isExtractNeed) {
      const fileBuffer = await sharp(image.buffer)
        .extract({
          top: Number(top),
          left: Number(left),
          width: Number(width),
          height: Number(height),
        })
        .webp({ effort: 3 })
        .toBuffer();

      await uploadBytes(storageRef, fileBuffer.buffer);
      // .toFile(path.join(filePath, filename));
    } else {
      const fileBuffer = await sharp(image.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toBuffer();
      await uploadBytes(storageRef, fileBuffer.buffer);
      // .toFile(path.join(filePath, filename));
    }

    return filename;
  }
}
