import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'picture' }, { name: 'video' }]),
  )
  createPost(@Body() dto: CreatePostDto, @UploadedFiles() files) {
    return this.postsService.create(dto, files);
  }
}
