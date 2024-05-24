import { Controller, Param, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friends')
export class FriendshipController {
  constructor(private frinedshipService: FriendshipService) {}

  @Post(':userSlug/add/:friendSlug')
  addFriend(
    @Param('userSlug') userSlug: string,
    @Param('friendSlug') friendSlug: string,
  ) {
    return this.frinedshipService.addFriend(userSlug, friendSlug);
  }
}
