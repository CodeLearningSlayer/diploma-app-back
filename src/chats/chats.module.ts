import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Message } from 'src/messages/messages.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatsController } from './chats.controller';
import { JwtService } from '@nestjs/jwt';
import { ProfileModule } from 'src/profile/profile.module';
import { Chat } from './chats.model';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [ChatsService, JwtService, ChatGateway],
  imports: [
    SequelizeModule.forFeature([Message, Chat]),
    ProfileModule,
    MessagesModule,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
