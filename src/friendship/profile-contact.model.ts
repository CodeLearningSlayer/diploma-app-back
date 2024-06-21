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
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  friendProfileId: number;

  @BelongsTo(() => Profile, 'friendProfileId')
  friend: Profile;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  initiatorProfileId: number;

  @BelongsTo(() => Profile, 'initiatorProfileId')
  initiator: Profile;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAccepted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeclined: boolean;
}
