import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from 'src/messages/messages.model';
import { Op } from 'sequelize';
import { Profile } from 'src/profile/profile.model';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat) private chatRepository: typeof Chat) {}

  public async GetChatById(chatId: number) {
    const chat = await this.chatRepository.findByPk(chatId, {
      include: [
        {
          model: Message,
        },
      ],
    });
    return {
      chat,
    };
  }

  public async CreateChat(createChatDto: CreateChatDto) {
    const isCreated = this.chatRepository.findOne({
      where: {
        [Op.or]: [
          {
            profileId1: createChatDto.firstProfileId,
            profileId2: createChatDto.secondProfileId,
          },
          {
            profileId1: createChatDto.secondProfileId,
            profile2: createChatDto.firstProfileId,
          },
        ],
      },
    });
    if (isCreated) {
      throw new HttpException(
        'This chat already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const chat = await this.chatRepository.create({ ...createChatDto });
    return {
      chat,
    };
  }

  public async GetMyChats(profileId: number) {
    const chats = await this.chatRepository.findAll({
      where: {
        [Op.or]: [
          {
            profileId1: profileId,
          },
          {
            profileId2: profileId,
          },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'profile1',
        },
        {
          model: Profile,
          as: 'profile2',
        },
        {
          model: Message,
          include: [
            {
              model: Profile,
            },
          ],
          as: 'messages',
          limit: 1,
          order: [['id', 'DESC']],
        },
      ],
    });

    const chatsWithFriendProfileOnly = chats.map((item) => {
      const chat = item.get({ plain: true });
      if (chat.profileId1 === profileId) {
        delete chat.profileId1;
        delete chat.profile1;
        return {
          ...chat,
          contact: chat.profile2,
        };
      } else if (chat.profileId2 === profileId) {
        delete chat.profileId2;
        delete chat.profile2;
      }
      return {
        ...chat,
        contact: chat.profile1,
      };
    });

    return {
      chats: chatsWithFriendProfileOnly,
    };
  }

  public async getChatById(id: number) {
    const chat = await this.chatRepository.findByPk(id, {
      include: [
        {
          model: Profile,
          as: 'profile1',
        },
        {
          model: Profile,
          as: 'profile2',
        },
        {
          model: Message,
          as: 'messages',
          limit: 20,
          order: [['id', 'DESC']],
          include: [
            {
              model: Profile,
            },
          ],
        },
      ],
    });
    if (chat) {
      chat.messages.sort((a, b) => a.id - b.id);
      return {
        chat,
      };
    }
    throw new HttpException('Chat not found', HttpStatus.BAD_REQUEST);
  }
}
