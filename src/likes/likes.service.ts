import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './likes.model';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like) private likeRepository: typeof Like) {}

  async likePost(postId: number, profileId: number) {
    const likedPost = await this.likeRepository.create({
      postId,
      profileId,
    });
    return likedPost;
  }

  async deleteLike(postId: number, profileId: number) {
    const like = await this.likeRepository.findOne({
      where: { postId, profileId },
    });

    if (like) {
      await like.destroy();
      await like.save();
      return;
    }

    throw new HttpException('like not found', HttpStatus.BAD_REQUEST);
  }
}
