import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { EditCommentDto, LeaveCommentDto } from './dto/comment';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('comment')
  leaveComment(@Body() leaveCommentDto: LeaveCommentDto) {
    return this.commentsService.leaveComment(leaveCommentDto);
  }

  @Patch(':profileId/comment/:postId')
  editComment(@Body() editCommentDto: EditCommentDto) {
    return this.commentsService.editComment(editCommentDto);
  }

  @Delete('/delete/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(+commentId);
  }

  @Get('/post/:postId')
  getPostComments(
    @Param('postId') postId: string,
    @Query('offset') offset: string,
  ) {
    return this.commentsService.getPostComments(+postId, +offset);
  }
}
