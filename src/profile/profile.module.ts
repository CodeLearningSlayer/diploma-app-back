import { Module, forwardRef } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './profile.model';
import { Post } from 'src/posts/posts.model';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, JwtService],
  imports: [SequelizeModule.forFeature([User, Profile, Post])],
  exports: [ProfileService],
})
export class ProfileModule {}
