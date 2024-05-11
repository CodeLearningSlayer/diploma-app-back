import { Body, Controller, Put, Req, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StartProfileDto } from './dto/start-profile';
import { User } from 'src/users/users.model';

@ApiTags('Профиль')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: 'Старт профиля' })
  @Put('/start')
  @UseGuards(JwtAuthGuard)
  startProfile(@Req() req, @Body() startProfileDto: StartProfileDto) {
    return this.profileService.startProfile(startProfileDto, req.user.id);
  }

  @ApiOperation({ summary: 'Получение моего профиля' })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMyAccount(@Req() req: Request & { user: User }) {
    return this.profileService.getMyAccount(req.user.id);
  }
}
