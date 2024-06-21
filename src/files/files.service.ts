import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { createUniqueName } from 'src/utils/file-upload';
import { createVideoThumbnail } from 'src/utils/video-upload';

export enum FileType {
  VIDEO = 'video',
  IMAGE = 'image',
}

@Injectable()
export class FilesService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: FirebaseApp) {}
  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      // TODO внести Multer, переписать всё
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + fileExtension; // TODO тут получить расширение файла и конкатенировать
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(
        'Error while uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(imageFileName: string) {
    const imageUrl = `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/images/${imageFileName}`;
    return {
      status: HttpStatus.OK,
      message: 'Image uploaded successfully!',
      data: imageUrl,
    };
  }

  async uploadMultipleImages(
    images: Express.Multer.File[],
    body: { temp: boolean },
  ) {
    try {
      const storage = getStorage(this.firebaseApp);
      let storagePath: string;
      if (body.temp) {
        storagePath = 'tmp';
      } else {
        storagePath = 'images';
      }

      const imgLinks = await Promise.all(
        images.map(async (img) => {
          const fileName = createUniqueName(img);
          const storageRef = ref(storage, `${storagePath}/` + fileName);
          await uploadBytes(storageRef, img.buffer, {
            contentType: img.mimetype,
          });
          const url = encodeURI(
            `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/${storagePath}/${fileName}`,
          );
          return url;
        }),
      );

      return {
        images: imgLinks,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async uploadMultipleVideos(
    videos: Express.Multer.File[],
    body: { temp: boolean },
  ) {
    try {
      console.log(videos);
      const storage = getStorage(this.firebaseApp);
      let storagePath: string;
      let thumbStoragePath: string;
      if (body.temp) {
        storagePath = 'tmp';
        thumbStoragePath = 'tmp';
      } else {
        storagePath = 'videos';
        thumbStoragePath = 'thumbnails';
      }

      const videoObjects = await Promise.all(
        videos.map(async (video) => {
          const fileName = createUniqueName(video);
          const videoStorageRef = ref(storage, `${storagePath}/` + fileName);
          const thumbFileName = `thumbnail-${fileName.split('.')[0]}.jpg`;
          const thumbnailStorageRef = ref(
            storage,
            `${thumbStoragePath}/` + thumbFileName,
          );
          await uploadBytes(videoStorageRef, video.buffer, {
            contentType: video.mimetype,
          });

          const { thumbnailBuffer } = await createVideoThumbnail(video);

          await uploadBytes(thumbnailStorageRef, thumbnailBuffer, {
            contentType: 'image/jpeg',
          });

          return {
            video: `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/${storagePath}/${fileName}`,
            thumbnail: `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/${thumbStoragePath}/${thumbFileName}`,
          };
        }),
      );

      return {
        videos: videoObjects,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
