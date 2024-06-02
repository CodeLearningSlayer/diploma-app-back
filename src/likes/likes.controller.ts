import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikePostDto } from './dto';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post('/like-post')
  @UseGuards(JwtAuthGuard)
  likePost(@Body() likePostDto: LikePostDto) {
    return this.likesService.likePost(
      likePostDto.postId,
      likePostDto.profileId,
    );
  }

  @Delete('/post/:postId/delete-like/:profileId')
  @UseGuards(JwtAuthGuard)
  deleteLike(
    @Param('postId') postId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.likesService.deleteLike(+postId, +profileId);
  }
}
