import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Message } from 'src/messages/messages.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatsController } from './chats.controller';
import { JwtService } from '@nestjs/jwt';
import { ProfileModule } from 'src/profile/profile.module';
import { Chat } from './chats.model';

@Module({
  providers: [ChatsService, JwtService],
  imports: [SequelizeModule.forFeature([Message, Chat]), ProfileModule],
  controllers: [ChatsController],
})
export class ChatsModule {}
