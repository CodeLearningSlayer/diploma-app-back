import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { CreateProfileDto } from './dto/create-profile';
import { StartProfileDto } from './dto/start-profile';

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

  async getMyAccount(id: number) {
    const profile = await this.getProfileByUserId(id);
    return {
      profile: profile,
    };
  }

  async startProfile(dto: StartProfileDto, userId: number) {
    const profile = await this.getProfileByUserId(userId);
    await profile.update({
      avatar: dto.avatar,
      fullName: `${dto.name} ${dto.surname}`,
      profession: dto.profession,
    });
    await profile.save();

    return {
      profile: profile,
    };
  }
}
