import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { CreateProfileDto } from './dto/create-profile';
import { StartProfileDto } from './dto/start-profile';
import { PostsService } from 'src/posts/posts.service';
import { translit } from 'src/utils/translit-name';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
    private postsService: PostsService,
  ) {}

  async createProfile(dto: CreateProfileDto) {
    const profile = await this.profileRepository.create(dto);
    return profile;
  }

  async getProfileByUserId(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
    });
    return profile;
  }

  async getProfileBySlug(slug: string) {
    const profile = await this.profileRepository.findOne({
      where: { slug },
      include: { all: true },
    });
    const profileValuesLength = Object.values(profile.dataValues).length;
    const profileCompletness =
      Object.values(profile.dataValues).filter((item) => !!item).length /
      profileValuesLength;
    return {
      user: profile,
      profile_completeness: Math.floor(profileCompletness * 100),
    };
  }

  async getMyAccount(id: number) {
    const profile = await this.getProfileByUserId(id);
    return {
      profile,
    };
  }

  async startProfile(dto: StartProfileDto, userId: number) {
    const profile = await this.getProfileByUserId(userId);
    await profile.update({
      avatar: dto.avatar,
      fullName: `${dto.name} ${dto.surname}`,
      profession: dto.profession,
      slug:
        translit(`${dto.name}${dto.surname}`) +
        '-' +
        uniqueSlug(`${dto.name} ${dto.surname}`.toLowerCase()),
    });
    await profile.save();

    return {
      profile: profile,
    };
  }
}
