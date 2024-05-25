import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friendship } from './profile-contact.model';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  providers: [FriendshipService],
  controllers: [FriendshipController],
  imports: [SequelizeModule.forFeature([Friendship]), ProfileModule],
})
export class FriendshipModule {}
