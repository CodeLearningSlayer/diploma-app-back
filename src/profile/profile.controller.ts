import {
  Body,
  Controller,
  Put,
  Req,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
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

  @ApiOperation({ summary: 'recommended friends' })
  @Get('/recommended-friends')
  @UseGuards(JwtAuthGuard)
  GetRecommendedFriends(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Req() req,
  ) {
    return this.profileService.getRecommendedFriends(req.user, +offset, +limit);
  }

  @ApiOperation({ summary: 'Получение профиля по слагу' })
  @Get('/:slug')
  // @UseGuards(JwtAuthGuard)
  GetUserBySlug(@Param() params: { slug: string }) {
    return this.profileService.getProfileBySlug(params.slug);
  }

  @ApiOperation({ summary: 'Получение моего профиля' })
  @Get('/:slug/posts')
  // @UseGuards(JwtAuthGuard)
  GetProfilePosts(@Param() params: { slug: string }) {
    return this.profileService.getProfileBySlug(params.slug);
  }
}
