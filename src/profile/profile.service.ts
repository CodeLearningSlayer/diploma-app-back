import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { CreateProfileDto } from './dto/create-profile';
import { StartProfileDto } from './dto/start-profile';
import { translit } from 'src/utils/translit-name';
import { Op } from 'sequelize';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
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
      include: { model: Post, limit: 12 },
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
      slug: (
        translit(`${dto.name}${dto.surname}`) +
        '-' +
        uniqueSlug(`${dto.name} ${dto.surname}`)
      ).toLowerCase(),
      isPrimaryInformationFilled: true,
    });
    await profile.save();

    return {
      profile: profile,
    };
  }

  async getRecommendedFriends(user: User, offset: number, limit: number) {
    const profiles = await this.profileRepository.findAll({
      limit,
      offset,
      where: {
        isPrimaryInformationFilled: true,
        [Op.not]: {
          userId: user.id,
        },
      },
    });
    return {
      peoples: profiles,
    };
  }
}
