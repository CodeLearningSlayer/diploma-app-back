import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('can activate');
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);
    if (!token) {
      throw new WsException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('secret'),
      });
      client['auth-user'] = payload;
    } catch {
      throw new WsException('Unauthorized');
    }
    return true;
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    console.log(client.handshake.auth, 'AUTH TOKEN');
    const [type, token] = client.handshake.auth.token?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
