import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getMyAccount(user: User) {
    return await this.userService.getUserByEmail(user.email);
  }
}
