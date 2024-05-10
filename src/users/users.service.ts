import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private profileService: ProfileService,
  ) {}
  async createUser(dto: CreateUserDto) {
    try {
      console.log(dto, 'DTO BEFORE CREATING');
      const user = await this.userRepository.create({ ...dto });
      const role = await this.roleService.getRoleByValue('user');
      await this.profileService.createProfile({
        userId: user.id,
      });
      await user.$set('roles', [role.id]);
      user.roles = [role];
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    console.log(email, 'EMAIL FROM GETUSER ');
    const user = this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      console.log('role and user');
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
