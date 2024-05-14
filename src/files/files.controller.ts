import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UploadedFiles,
  Body,
  // HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/pipes/optimizeImage.pipe';
// import { CroppPipe } from 'src/pipes/croppImage.pipe';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(SharpPipe) image: string) {
    return this.fileService.uploadImage(image);
  }

  @Post('upload/image/multiple')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadMultipleImages(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: { temp: boolean },
  ) {
    return this.fileService.uploadMultipleImages(images, body);
  }

  @Post('upload/video/multiple')
  @UseInterceptors(FilesInterceptor('videos', 10))
  async uploadMultipleVideos(
    @UploadedFiles() videos: Express.Multer.File[],
    @Body() body: { temp: boolean },
  ) {
    return this.fileService.uploadMultipleVideos(videos, body);
  }

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('file', {}))
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
