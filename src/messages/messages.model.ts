import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chat } from 'src/chats/chats.model';
import { Profile } from 'src/profile/profile.model';

interface MessageCreationAttrs {
  profileId: number;
  userName: string;
  text: string;
}

@Table({ tableName: 'messages' })
export class Message extends Model<Message, MessageCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => Profile)
  profile: Profile;

  @ForeignKey(() => Chat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chatId: number;

  @BelongsTo(() => Chat)
  chat: Chat;
}
