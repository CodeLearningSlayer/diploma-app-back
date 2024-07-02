import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from './guards/ws.guard';
import { MessagesService } from 'src/messages/messages.service';
import { extractTokenFromHeader } from 'src/utils/extractTokenFromHeader';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private profileService: ProfileService,
  ) {}
  // The server is used to emit events to all clients
  @WebSocketServer()
  server: Server;

  private async verifyUser(client: Socket) {
    const token = extractTokenFromHeader(client);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('secret'),
      });
      return payload ?? undefined;
    } catch (e) {
      console.log('Token verification error: ', e);
    }
  }

  async handleConnection(client: Socket) {
    const user = await this.verifyUser(client);
    if (user) {
      const profile = await this.profileService.getProfileByUserId(user.id);
      profile.isOnline = true;
      await profile.save();
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.verifyUser(client);
    if (user) {
      const profile = await this.profileService.getProfileByUserId(user.id);
      profile.isOnline = false;
      await profile.save();
    }
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
    try {
      const { chatId, profileId, text } = data;
      // подключение идёт каждый раз, это не круто, подключить однажды ивентом?
      const res = await this.messagesService.createMessage({
        chatId,
        profileId,
        text,
      });
      console.log(res);
      this.server.to(chatId.toString()).emit('message', res.message);
    } catch (e) {
      client.emit('error', { message: e });
    }
  }

  @SubscribeMessage('join')
  join(client: Socket, payload: any) {
    client.join(payload.chatId);
  }

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
