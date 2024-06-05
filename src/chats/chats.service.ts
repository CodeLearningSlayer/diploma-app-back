import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from 'src/messages/messages.model';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat) private chatRepository: typeof Chat) {}

  public async GetMyChats(profileId: number) {}

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
    const chat = await this.chatRepository.create({ ...createChatDto });
    return {
      chat,
    };
  }
}
