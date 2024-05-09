import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, JwtService],
  imports: [SequelizeModule.forFeature([User]), UsersModule],
  exports: [ProfileService],
})
export class ProfileModule {}
