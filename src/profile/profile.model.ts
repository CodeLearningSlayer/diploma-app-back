import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';

import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { Friendship } from '../friendship/profile-contact.model';
import { Like } from 'src/likes/likes.model';
import { Comment } from 'src/comments/comments.model';
import { Message } from 'src/messages/messages.model';
import { Chat } from 'src/chats/chats.model';

interface ProfileCreationAttrs {
  fullName: string;
  profession: string;
  userId: number;
  bio: string;
  birthday: string;
  contact: string;
  company: string;
  slug: string;
  interests: string;
  avatar: string;
  education: string;
  skills: string;
  isPrimaryInformationFilled: boolean;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fullName: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPrimaryInformationFilled: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bio: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  slug: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  birthday: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  education: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profession: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contact: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  skills: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  interests: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Friendship)
  friends: Friendship[];

  @HasMany(() => Friendship)
  friendRequests: Friendship[];

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Message)
  messages: Message[];

  @HasMany(() => Chat, 'profileId1')
  initiatedChats: Chat[];

  @HasMany(() => Chat, 'profileId2')
  receivedChats: Chat[];
}
