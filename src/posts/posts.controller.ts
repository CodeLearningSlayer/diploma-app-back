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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'img' }, { name: 'video' }]))
  createPost(
    @Req() req: Request & { user: User },
    @Body() dto: CreatePostDto,
    @UploadedFiles()
    files: { img: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    return this.postsService.create(dto, files, req.user.id);
  }
}
