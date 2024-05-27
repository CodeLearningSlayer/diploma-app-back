import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friendship } from './profile-contact.model';
import { Op } from 'sequelize';
import { Profile } from 'src/profile/profile.model';

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
    const friendships = await this.friendshipModel.findAll({
      where: {
        [Op.or]: [
          {
            profileId,
          },
          { friendProfileId: profileId },
        ],
        isAccepted: true,
      },
      include: [
        {
          model: Profile,
          as: 'profile',
          where: {
            id: {
              [Op.ne]: profileId,
            },
          },
          required: false,
        },
        {
          model: Profile,
          as: 'friend',
          where: {
            id: {
              [Op.ne]: profileId,
            },
          },
          required: false,
        },
      ], // вот тут вернет именно модели, на которые ссылается "дружба"
    });

    const friends = [];
    for (const friendship of friendships) {
      if (friendship.profile && friendship.profile.id !== profileId) {
        friends.push(friendship.profile);
      }
      if (friendship.friend && friendship.friend.id !== profileId) {
        friends.push(friendship.friend);
      }
    }

    // Удаляем дублирующиеся профили
    const uniqueFriends = Array.from(
      new Set(friends.map((friend) => friend.id)),
    ).map((id) => friends.find((friend) => friend.id === id));

    return uniqueFriends;
  }

  async getFriendRequests(profileId: number): Promise<Friendship[]> {
    return this.friendshipModel.findAll({
      where: { profileId, isAccepted: false },
      include: ['user'],
    });
  }

  async deleteFriend(profileId: number, friendProfileId: number) {
    const friendship = await this.friendshipModel.findOne({
      where: {
        [Op.or]: [
          {
            profileId,
            friendProfileId,
          },
          {
            profileId: friendProfileId,
            friendProfileId: profileId,
          },
        ],
      },
    });
    if (friendship) {
      friendship.isAccepted = false;
      friendship.initiatorProfileId = friendProfileId;
      await friendship.save();
      return;
    }
    throw new HttpException('Friendship not found', HttpStatus.BAD_REQUEST);
  }

  async cancelDeleteFriend(profileId: number, friendProfileId: number) {
    const friendship = await this.friendshipModel.findOne({
      where: {
        [Op.or]: [
          {
            profileId,
            friendProfileId,
          },
          {
            profileId: friendProfileId,
            friendProfileId: profileId,
          },
        ],
      },
    });
    if (friendship) {
      friendship.isAccepted = true;
      await friendship.save();
      return;
    }
    throw new HttpException('Friendship not found', HttpStatus.BAD_REQUEST);
  }

  async findFriend(profileId: number, searchTerm: string) {
    const friendships = await this.friendshipModel.findAll({
      where: {
        [Op.or]: [{ profileId }, { friendProfileId: profileId }],
        isAccepted: true,
      },
      include: [
        {
          model: Profile,
          as: 'profile',
          where: {
            fullName: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          required: false,
        },
        {
          model: Profile,
          as: 'friend',
          where: {
            fullName: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          required: false,
        },
      ],
    });

    const friends = [];
    for (const friendship of friendships) {
      if (friendship.profile && friendship.profile.id !== profileId) {
        friends.push(friendship.profile);
      }
      if (friendship.friend && friendship.friend.id !== profileId) {
        friends.push(friendship.friend);
      }
    }

    // Удаляем дублирующиеся профили
    const uniqueFriends = Array.from(
      new Set(friends.map((friend) => friend.id)),
    ).map((id) => friends.find((friend) => friend.id === id));

    return uniqueFriends;
  }
}
