import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/users.model';
import { ProfileService } from 'src/profile/profile.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { MessagesService } from 'src/messages/messages.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private profileService: ProfileService,
  ) {}

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyChats(@Req() req: Request & { user: User }) {
    const profile = await this.profileService.getProfileByUserId(req.user.id);
    return this.chatsService.GetMyChats(profile.id);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createChat(@Body() createChatDto: CreateChatDto) {
    const chat = await this.chatsService.CreateChat(createChatDto);
    return chat;
  }

  @Get(':chatId/messages')
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query('offset') offset: string,
  ) {
    return this.messagesService.getChatMessages(+chatId, +offset);
  }

  @Get(':chatId')
  async getChatById(@Param('chatId') chatId: string) {
    return this.chatsService.getChatById(+chatId);
  }
}
