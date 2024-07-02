import { Socket } from 'socket.io';

export const extractTokenFromHeader = (client: Socket): string | undefined => {
  console.log(client.handshake.auth, 'AUTH TOKEN');
  const [type, token] = client.handshake.auth.token?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
