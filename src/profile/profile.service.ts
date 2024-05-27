import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { CreateProfileDto } from './dto/create-profile';
import { StartProfileDto } from './dto/start-profile';
import { translit } from 'src/utils/translit-name';
import { Op } from 'sequelize';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { Friendship } from 'src/friendship/profile-contact.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
    @InjectModel(Friendship) private friendshipRepository: typeof Friendship,
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
    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    console.log(profile.id, 'PROFILE ID');

    const friends = await this.friendshipRepository.findAll({
      where: {
        [Op.or]: [{ profileId: profile.id }, { friendProfileId: profile.id }],
      },
    });

    const friendsIds = new Set<number>();

    friends.forEach((item) => {
      friendsIds.add(item.profileId);
      friendsIds.add(item.friendProfileId);
    });

    const recommendations = await this.profileRepository.findAll({
      limit,
      offset,
      where: {
        isPrimaryInformationFilled: true,
        id: {
          [Op.notIn]: [profile.id, ...friendsIds],
        },
      },
    });

    return {
      peoples: recommendations,
    };
  }
}
