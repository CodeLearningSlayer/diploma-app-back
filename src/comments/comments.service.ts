import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comments.model';
import { EditCommentDto, LeaveCommentDto } from './dto/comment';
import { Profile } from 'src/profile/profile.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
  ) {}

  async leaveComment(createCommetDto: LeaveCommentDto) {
    const comment = await this.commentRepository.create({
      postId: createCommetDto.postId,
      profileId: createCommetDto.profileId,
      text: createCommetDto.text,
    });

    return {
      comment,
    };
  }

  async deleteComment(commentId: number) {
    const comment = await this.commentRepository.findByPk(commentId);
    if (comment) {
      await comment.destroy();
      await comment.save();
      return;
    }

    throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
  }

  async editComment(editCommentDto: EditCommentDto) {
    const comment = await this.commentRepository.findByPk(
      editCommentDto.commentId,
    );
    if (comment) {
      comment.text = editCommentDto.text.trim();
      await comment.save();
      return;
    }

    throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
  }

  async getPostComments(postId: number) {
    const comments = await this.commentRepository.findAll({
      where: {
        postId,
      },
      include: {
        model: Profile,
      },
    });

    return {
      comments,
    };
  }
}
