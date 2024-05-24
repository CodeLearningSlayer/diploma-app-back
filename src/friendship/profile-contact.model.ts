import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Profile } from 'src/profile/profile.model';

@Table({ tableName: 'friendships' })
export class Friendship extends Model<Friendship> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.STRING })
  profileSlug: string;

  @BelongsTo(() => Profile, 'profileSlug')
  profile: Profile;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.STRING })
  contactProfileSlug: string;

  @BelongsTo(() => Profile, 'contactProfileSlug')
  friend: Profile;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAccepted: boolean;
}
