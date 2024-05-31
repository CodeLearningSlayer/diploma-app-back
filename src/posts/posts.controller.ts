import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
  Get,
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
  createPost(@Req() req: Request & { user: User }, @Body() dto: CreatePostDto) {
    return this.postsService.create(dto, req.user.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  @Get(':profileId/posts')
  // @UseGuards(JwtAuthGuard)
  GetProfilePosts(@Param('profileId') profileId: string) {
    return this.postsService.getProfilePosts(+profileId);
  }
}
