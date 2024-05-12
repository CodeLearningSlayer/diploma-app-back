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
  async create(
    dto: CreatePostDto,
    files: { img: Express.Multer.File[]; video: Express.Multer.File[] },
    userId: number,
  ) {
    const profile = await this.profileService.getProfileByUserId(userId);

    const imgLinks = files.img?.map(
      (img) => `${process.env.APP_URL}:${process.env.PORT}/${img.filename}`,
    );
    const videoLinks = files.video?.map(
      (img) => `${process.env.APP_URL}:${process.env.PORT}/${img.filename}`,
    );
    const post = await this.postRepository.create({
      ...dto,
      images: imgLinks,
      videos: videoLinks,
      profileId: profile.id,
    });
    await post.save();
    return post;
  }

  async getProfilePosts(profileId: number) {
    const posts = await this.postRepository.findAll({ where: { profileId } });
    return {
      posts,
    };
  }
}
