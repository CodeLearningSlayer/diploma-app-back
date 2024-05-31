import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post('/:profileId/like/:postId')
  @UseGuards(JwtAuthGuard)
  likePost(
    @Param('postId') postId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.likesService.likePost(+postId, +profileId);
  }

  @Delete('/:profileId/like/:postId')
  @UseGuards(JwtAuthGuard)
  deleteLike(
    @Param('postId') postId: string,
    @Param('postId') profileId: string,
  ) {
    return this.likesService.deleteLike(+postId, +profileId);
  }
}
