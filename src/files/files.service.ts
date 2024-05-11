import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

export enum FileType {
  VIDEO = 'video',
  IMAGE = 'image',
}
@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}
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
    const imageUrl = `${process.env.APP_URL}:${process.env.PORT}/${imageFileName}`;
    return {
      status: HttpStatus.OK,
      message: 'Image uploaded successfully!',
      data: imageUrl,
    };
  }
}
