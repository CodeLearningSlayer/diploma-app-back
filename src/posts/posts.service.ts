import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { ProfileService } from 'src/profile/profile.service';
import { Like } from 'src/likes/likes.model';
import { Comment } from 'src/comments/comments.model';
import { Profile } from 'src/profile/profile.model';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @InjectModel(Comment) private commentRepository: typeof Comment,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {}
  async create(dto: CreatePostDto, userId: number) {
    try {
      const profile = await this.profileService.getProfileByUserId(userId);

      const post = await this.postRepository.create({
        ...dto,
        images: dto.img,
        videos: dto.video,
        profileId: profile.id,
      });

      const postWithComments = await this.postRepository.findOne({
        where: {
          id: post.id,
        },
        include: [
          {
            model: Like,
          },
          {
            model: Comment,
          },
        ],
      });

      await post.save();
      return postWithComments;
    } catch (e) {
      console.log(e);
    }
  }

  async delete(id: number) {
    await this.postRepository.destroy({ where: { id } });
  }

  async getProfilePosts(profileId: number): Promise<{ posts: PostDto[] }> {
    const posts = await this.postRepository.findAll({
      where: { profileId },
      order: [['id', 'DESC']],
      include: [
        {
          model: Like,
        },
        {
          model: Comment,
          limit: 3,
          include: [Profile],
        },
      ],
    });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await this.commentRepository.count({
          where: { postId: post.id },
        });

        return {
          ...post.get({ plain: true }),
          commentsCount,
        };
      }),
    );

    return {
      posts: postsWithCommentCount,
    };
  }
}
