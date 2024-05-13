import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { ProfileService } from 'src/profile/profile.service';
import { ref, uploadBytes } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';
import { createUniqueName } from 'src/utils/file-upload';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
    @Inject('FIREBASE_APP')
    private firebaseApp: FirebaseApp,
  ) {}
  async create(
    dto: CreatePostDto,
    files: { img: Express.Multer.File[]; video: Express.Multer.File[] },
    userId: number,
  ) {
    try {
      // ! Зарефакторить код, разбить в асинхронщину

      const storage = getStorage(this.firebaseApp);

      const profile = await this.profileService.getProfileByUserId(userId);

      const imgLinks = await Promise.all(
        files.img?.map(async (img) => {
          const fileName = createUniqueName(img);
          const storageRef = ref(storage, 'images/' + fileName);
          console.log(storageRef);
          await uploadBytes(storageRef, img.buffer, {
            contentType: img.mimetype,
          });
          const url = encodeURI(
            `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/images/${fileName}`,
          );
          return url;
        }),
      );

      const videos = await Promise.all(
        files.video?.map(async (video) => {
          const fileName = createUniqueName(video);
          const videoStorageRef = ref(storage, 'videos/' + fileName);
          const thumbFileName = `thumbnail-${fileName.split('.')[0]}.jpg`;
          const thumbnailStorageRef = ref(
            storage,
            'thumbnails/' + thumbFileName,
          );
          await uploadBytes(videoStorageRef, video.buffer, {
            contentType: video.mimetype,
          });

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

          await uploadBytes(thumbnailStorageRef, thumbnailBuffer, {
            contentType: 'image/jpeg',
          });

          return {
            video: `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/videos/${fileName}`,
            thumbnail: `https://storage.googleapis.com/${this.firebaseApp.options.storageBucket}/thumbnails/${thumbFileName}`,
          };
        }),
      );

      const post = await this.postRepository.create({
        ...dto,
        images: imgLinks,
        videos,
        profileId: profile.id,
      });

      await post.save();
      return post;
    } catch (e) {
      console.log(e);
    }
  }

  async getProfilePosts(profileId: number) {
    const posts = await this.postRepository.findAll({ where: { profileId } });
    return {
      posts,
    };
  }
}
