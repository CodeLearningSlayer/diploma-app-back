import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('friends')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post(':profileId/add/:friendProfileId')
  @UseGuards(JwtAuthGuard)
  addFriend(
    @Param('profileId') profileId: number,
    @Param('friendProfileId') friendProfileId: number,
  ) {
    return this.friendshipService.addFriend(profileId, friendProfileId);
  }

  @Post(':profileId/accept/:friendProfileId')
  @UseGuards(JwtAuthGuard)
  acceptFriend(
    @Param('profileId') profileId: string,
    @Param('friendProfileId') friendProfileId: string,
  ) {
    return this.friendshipService.acceptFriend(+profileId, +friendProfileId);
  }

  @Delete(':profileId/delete/:friendProfileId')
  @UseGuards(JwtAuthGuard)
  deleteFriend(
    @Param('profileId') profileId: string,
    @Param('friendProfileId') friendProfileId: string,
  ) {
    return this.friendshipService.deleteFriend(+profileId, +friendProfileId);
  }

  @Post(':profileId/cancel-delete/:friendProfileId')
  @UseGuards(JwtAuthGuard)
  cancelDeleteFriend(
    @Param('profileId') profileId: string,
    @Param('friendProfileId') friendProfileId: string,
  ) {
    return this.friendshipService.cancelDeleteFriend(
      +profileId,
      +friendProfileId,
    );
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchFriends(
    @Query('profileId') profileId: string,
    @Query('searchTerm') searchTerm: string,
  ) {
    console.log(profileId, searchTerm);
    return this.friendshipService.findFriend(+profileId, searchTerm);
  }

  @Get(':profileId/requests')
  @UseGuards(JwtAuthGuard)
  getFriendsRequest(@Param('profileId') profileId: string) {
    return this.friendshipService.getFriendRequests(+profileId);
  }

  @Get(':profileId/sent-requests')
  @UseGuards(JwtAuthGuard)
  getSentRequests(@Param('profileId') profileId: string) {
    return this.friendshipService.getSentRequests(+profileId);
  }

  @Get(':profileId/declined')
  @UseGuards(JwtAuthGuard)
  getDeclinedFriendsRequest(@Param('profileId') profileId: string) {
    return this.friendshipService.getDeclinedFriendsRequest(+profileId);
  }

  @Get(':profileId')
  @UseGuards(JwtAuthGuard)
  getFriends(@Param('profileId') profileId: number) {
    return this.friendshipService.getFriends(profileId);
  }
}
