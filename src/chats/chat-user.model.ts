import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { Profile } from 'src/profile/profile.model'; // Обновите путь в зависимости от вашей структуры
import { Chat } from 'src/chats/chats.model'; // Обновите путь в зависимости от вашей структуры

@Table({ tableName: 'chat_users' })
export class ChatUser extends Model<ChatUser> {
  @PrimaryKey
  @ForeignKey(() => Chat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chatId: number;

  @PrimaryKey
  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId: number;
}
