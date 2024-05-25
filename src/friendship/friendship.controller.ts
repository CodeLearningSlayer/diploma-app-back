import { Controller, Param, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friends')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post(':profileId/add/:friendProfileId')
  addFriend(
    @Param('profileId') profileId: number,
    @Param('friendProfileId') friendProfileId: number,
  ) {
    return this.friendshipService.addFriend(profileId, friendProfileId);
  }
}
