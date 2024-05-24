import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileModule } from './profile/profile.module';
import configurations from './config';
import * as path from 'path';
import { Profile } from './profile/profile.model';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseModule } from './firebase/firebase.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  providers: [],
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configurations],
    }),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('host'),
        port: configService.get('dbPort'),
        username: configService.get('username'),
        password: configService.get('password'),
        database: configService.get('database'),
        models: [User, Role, UserRoles, Profile, Post],
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
    ProfileModule,
    FirebaseModule,
    FriendshipModule,
  ],
})
export class AppModule {}
