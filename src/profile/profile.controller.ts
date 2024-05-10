import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';

@ApiTags('Профиль')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  // @ApiOperation({ summary: 'Получение моего профиля' })
  // @Get('/me')
  // @UseGuards(JwtAuthGuard)
  // getMyAccount(@Req() req: Request & { user: User }) {
  //   console.log(req);
  //   return this.profileService.getMyAccount(req.user);
  // }
}
