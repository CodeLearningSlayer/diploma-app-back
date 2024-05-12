import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { editFileName } from 'src/utils/file-upload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'img' }, { name: 'video' }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const filePath = path.resolve(__dirname, '..', 'static');
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
          }
          cb(null, filePath);
        },
        filename: editFileName,
      }),
    }),
  )
  createPost(
    @Req() req: Request & { user: User },
    @Body() dto: CreatePostDto,
    @UploadedFiles()
    files: { img: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    const { img, video } = files;
    console.log(img, video);
    return this.postsService.create(dto, files, req.user.id);
  }
}
