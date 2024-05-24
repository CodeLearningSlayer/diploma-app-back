import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friendship } from './profile-contact.model';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship) private friendshipModel: typeof Friendship,
  ) {}

  async addFriend(profileSlug: string, friendProfileSlug: string) {
    return this.friendshipModel.create({
      profileSlug,
      contactProfileSlug: friendProfileSlug,
    });
  }

  async acceptFriend(profileSlug: string, friendProfileSlug: string) {
    const friendship = await this.friendshipModel.findOne({
      where: { profileSlug, contactProfileSlug: friendProfileSlug },
    });

    if (friendship) {
      friendship.isAccepted = true;
      await friendship.save();
      return friendship;
    }
    throw new Error('Friend request not found');
  }

  async getFriends(profileSlug: string): Promise<Friendship[]> {
    return this.friendshipModel.findAll({
      where: { profileSlug, isAccepted: true },
      include: ['friend'], // вот тут вернет именно модели, на которые ссылается "дружба"
    });
  }

  async getFriendRequests(profileSlug: string): Promise<Friendship[]> {
    return this.friendshipModel.findAll({
      where: { profileSlug, isAccepted: false },
      include: ['user'],
    });
  }
}
