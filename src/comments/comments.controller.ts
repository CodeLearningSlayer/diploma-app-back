import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Delete('/profile/:profileId/post/:postId/comment/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(+commentId);
  }

  @Get(':postId')
  getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(+postId);
  }
}
