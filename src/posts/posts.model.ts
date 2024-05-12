import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Profile } from 'src/profile/profile.model';

interface PostCreationAttrs {
  text: string;
  profileId: number;
  images: string[];
  videos: string[];
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
    unique: true,
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
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  videos: string[];

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
}
