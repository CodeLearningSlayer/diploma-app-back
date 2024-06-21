import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { WsGuard } from './guards/ws.guard';
import { MessagesService } from 'src/messages/messages.service';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  constructor(private messagesService: MessagesService) {}
  // The server is used to emit events to all clients
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  /**
   * When a user disconnects, we'll remove them from the users array and emit the updated list of users to all clients
   * @param client The socket of the client that disconnected
   * @emits users
   */

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { chatId: number; profileId: number; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, profileId, text } = data;
    const res = await this.messagesService.createMessage({
      chatId,
      profileId,
      text,
    });
    console.log(res);
    this.server.emit('message', res.message);
  }

  // @SubscribeMessage('join')
  // join(client: Socket, payload: any) {
  //   client.join(payload.chatId);
  //   this.users.push({ id: client.id, ...payload });
  //   this.server.emit('users', this.users);
  // }

  /**
   * When a user requests the messages for them and another user, we will filter the messages array and return the messages that match the sender and recipient
   * @param payload The payload sent by the client
   * @returns The messages that match the sender and recipient
   */
  // @SubscribeMessage('request-messages')
  // requestMessages(@MessageBody() payload: any) {
  //   const msgs = this.messages.filter(
  //     (m) =>
  //       (m.recipient == payload.recipient && m.sender == payload.sender) ||
  //       (m.recipient == payload.sender && m.sender == payload.recipient),
  //   );
  //   return msgs;
  // }

  /**
   * When a user sends a message, we'll add it to the messages array and emit the message to the recipient
   * @param payload The payload sent by the client
   * @emits new message
   */
  @SubscribeMessage('new message')
  newMessage(@MessageBody() payload: any) {
    // this.messages.push(payload);
    this.server.to(payload.recipient).emit('new message', payload);
  }
}
