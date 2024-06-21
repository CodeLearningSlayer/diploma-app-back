import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { MessageDto } from './dto';
import { Profile } from 'src/profile/profile.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
  ) {}

  async createMessage(messageDto: MessageDto) {
    const message = await this.messageRepository.create(messageDto);

    const messageWithAuthor = await this.messageRepository.findByPk(
      message.id,
      {
        include: {
          model: Profile,
          as: 'profile',
        },
      },
    );

    if (messageWithAuthor) {
      return {
        message: messageWithAuthor,
      };
    }

    return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  async deleteMessage(messageDto: MessageDto) {
    const message = await this.messageRepository.create(messageDto);

    const messageWithAuthor = this.messageRepository.findByPk(message.id);

    if (messageWithAuthor) {
      return {
        message: messageWithAuthor,
      };
    }

    return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  async getChatMessages(chatId: number, offset: number) {
    const messages = await this.messageRepository.findAll({
      where: {
        chatId,
      },
      limit: 20,
      offset,
      order: [['id', 'DESC']],
      include: {
        model: Profile,
      },
    });

    return {
      messages,
    };
  }
}
