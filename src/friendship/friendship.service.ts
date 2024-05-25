import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friendship } from './profile-contact.model';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship) private friendshipModel: typeof Friendship,
  ) {}

  async addFriend(profileId: number, friendProfileId: number) {
    return this.friendshipModel.create({
      profileId,
      friendProfileId,
      initiatorProfileId: profileId,
    });
  }

  async acceptFriend(profileId: number, friendProfileId: number) {
    const friendship = await this.friendshipModel.findOne({
      where: { profileId, friendProfileId },
    });

    if (friendship) {
      friendship.isAccepted = true;
      await friendship.save();
      return friendship;
    }
    throw new Error('Friend request not found');
  }

  async getFriends(profileId: number): Promise<Friendship[]> {
    return this.friendshipModel.findAll({
      where: { profileId, isAccepted: true },
      include: ['friend'], // вот тут вернет именно модели, на которые ссылается "дружба"
    });
  }

  async getFriendRequests(profileId: number): Promise<Friendship[]> {
    return this.friendshipModel.findAll({
      where: { profileId, isAccepted: false },
      include: ['user'],
    });
  }
}
