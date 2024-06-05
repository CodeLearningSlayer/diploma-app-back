import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/users.model';
import { ProfileService } from 'src/profile/profile.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private chatsService: ChatsService,
    private profileService: ProfileService,
  ) {}

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyChats(@Req() req: Request & { user: User }) {
    const profile = await this.profileService.getProfileByUserId(req.user.id);
    return this.chatsService.GetMyChats(profile.id);
  }
}
