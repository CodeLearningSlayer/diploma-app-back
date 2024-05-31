import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from 'src/posts/posts.model';
import { Profile } from 'src/profile/profile.model';

interface LikeCreationAttrs {
  profileId: number;
  postId: number;
}

@Table({ tableName: 'likes' })
export class Like extends Model<Like, LikeCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => Profile)
  profile: Profile;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
