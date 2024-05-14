import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

import { createUniqueName } from './file-upload';

export const createVideoThumbnail = async (video: Express.Multer.File) => {
  const fileName = createUniqueName(video);
  const thumbFileName = `thumbnail-${fileName.split('.')[0]}.jpg`;

  const tempFilePath = path.resolve(__dirname, 'temp');
  if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath, { recursive: true });
  }
  fs.writeFileSync(path.join(tempFilePath, fileName), video.buffer);

  const createThumbnailPromise = new Promise((resolve, reject) => {
    ffmpeg(path.join(tempFilePath, fileName))
      .screenshot({
        timestamps: ['50%'],
        folder: tempFilePath,
        filename: thumbFileName,
      })
      .on('error', () => {
        reject("Can't get video thumbnail");
      })
      .on('end', () => {
        resolve(path.join(tempFilePath, thumbFileName));
      });
  });

  const thumbPath = await createThumbnailPromise;
  const thumbnailBuffer = fs.readFileSync(thumbPath as string);

  return {
    thumbnailBuffer,
  };
};
