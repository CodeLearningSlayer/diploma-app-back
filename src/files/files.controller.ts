import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  // HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('file', {}))
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
