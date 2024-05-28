import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friendship } from './profile-contact.model';
import { Op } from 'sequelize';
import { Profile } from 'src/profile/profile.model';
import { getUniqueProfiles } from 'src/utils/get-unique-profiles';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship) private friendshipModel: typeof Friendship,
  ) {}

  async addFriend(profileId: number, friendProfileId: number) {
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
        isAccepted: false,
      },
    });

    if (!friendship) {
      return this.friendshipModel.create({
        profileId,
        friendProfileId,
        initiatorProfileId: profileId,
      });
    }
  }

  async acceptFriend(profileId: number, friendProfileId: number) {
    const friendship = await this.friendshipModel.findOne({
      where: {
        [Op.or]: [
          { profileId, friendProfileId },
          { profileId: friendProfileId, friendProfileId: profileId },
        ],
      },
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
    const friendships = await this.friendshipModel.findAll({
      where: {
        [Op.or]: [
          {
            profileId,
            initiatorProfileId: {
              [Op.ne]: profileId,
            },
            isAccepted: false,
          },
          {
            friendProfileId: profileId,
            initiatorProfileId: {
              [Op.ne]: profileId,
            },
            isAccepted: false,
          },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'profile',
          required: false,
        },
        {
          model: Profile,
          as: 'friend',
          required: false,
        },
      ],
    });

    const uniqueFriends = getUniqueProfiles(friendships, profileId);
    return uniqueFriends;
  }

  async getDeclinedFriendsRequest(profileId: number) {
    const friendships = await this.friendshipModel.findAll({
      where: {
        [Op.or]: [
          {
            profileId,
            initiatorProfileId: {
              [Op.ne]: profileId,
            },
            isAccepted: false,
            isDeclined: true,
          },
          {
            friendProfileId: profileId,
            initiatorProfileId: {
              [Op.ne]: profileId,
            },
            isAccepted: false,
            isDeclined: true,
          },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'profile',
          required: false,
        },
        {
          model: Profile,
          as: 'friend',
          required: false,
        },
      ],
    });

    const uniqueFriends = getUniqueProfiles(friendships, profileId);
    return uniqueFriends;
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

    if (!friendship) {
      throw new HttpException('Friendship not found', HttpStatus.BAD_REQUEST);
    }

    if (friendship.isAccepted) {
      friendship.isAccepted = false;
      friendship.initiatorProfileId = friendProfileId;
      await friendship.save();
      return;
    } else if (friendship.initiatorProfileId === profileId) {
      friendship.destroy();
      await friendship.save();
      return;
    } else {
      friendship.isDeclined = true;
      await friendship.save();
      return;
    }
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

    const uniqueFriends = getUniqueProfiles(friendships, profileId);

    return uniqueFriends;
  }

  async getSentRequests(profileId: number) {
    const friendships = await this.friendshipModel.findAll({
      where: {
        [Op.or]: [
          {
            profileId,
            initiatorProfileId: profileId,
            isAccepted: false,
          },
          {
            friendProfileId: profileId,
            initiatorProfileId: profileId,
            isAccepted: false,
          },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'profile',
          required: false,
        },
        {
          model: Profile,
          as: 'friend',
          required: false,
        },
      ],
    });

    const uniqueFriends = getUniqueProfiles(friendships, profileId);
    return uniqueFriends;
  }
}
