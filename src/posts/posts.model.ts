import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Like } from 'src/likes/likes.model';
import { Profile } from 'src/profile/profile.model';
import { Comment } from 'src/comments/comments.model';

interface PostCreationAttrs {
  text: string;
  profileId: number;
  images: string[];
  videos: Array<{
    video: string;
    thumbnail: string;
  }>;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'mail@ya.ru', description: 'Эл. почта' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @ApiProperty({ example: 'dhjhfskfdsk', description: 'Пароль' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  images: string[];

  @ApiProperty({ example: 'dhjhfskfdsk', description: 'Пароль' })
  @Column({
    type: DataType.ARRAY(DataType.JSON),
    allowNull: true,
  })
  videos: Array<{
    video: string;
    thumbnail: string;
  }>;

  @ApiProperty({ example: 'dhjhfskfdsk', description: 'Пароль' })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  event: string;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => Profile)
  profile: Profile;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];
}
