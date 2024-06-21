import {
  Column,
  DataType,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Message } from 'src/messages/messages.model'; // Обновите путь в зависимости от вашей структуры
import { Profile } from 'src/profile/profile.model';

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  id: number;

  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId1: number;

  @BelongsTo(() => Profile, 'profileId1')
  profile1: Profile;

  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId2: number;

  @BelongsTo(() => Profile, 'profileId2')
  profile2: Profile;

  @HasMany(() => Message)
  messages: Message[];
}
