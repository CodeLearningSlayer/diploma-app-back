import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
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

      await post.save();
      return post;
    } catch (e) {
      console.log(e);
    }
  }

  async delete(id: number) {
    await this.postRepository.destroy({ where: { id } });
  }

  async getProfilePosts(profileId: number) {
    const posts = await this.postRepository.findAll({
      where: { profileId },
      order: ['id', 'DESC'],
    });
    return {
      posts,
    };
  }
}
