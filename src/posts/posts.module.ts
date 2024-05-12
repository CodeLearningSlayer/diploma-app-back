import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesModule } from '../files/files.module';
import { Profile } from 'src/profile/profile.model';
import { User } from 'src/users/users.model';
import { ProfileModule } from 'src/profile/profile.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PostsService, JwtService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([Post, Profile, User]),
    FilesModule,
    forwardRef(() => ProfileModule),
  ],
  exports: [PostsService],
})
export class PostsModule {}
