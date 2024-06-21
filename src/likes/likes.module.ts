import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Like } from './likes.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikesController } from './likes.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [LikesService, JwtService],
  imports: [SequelizeModule.forFeature([Like])],
  controllers: [LikesController],
})
export class LikesModule {}
