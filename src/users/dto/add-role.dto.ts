import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({ example: 'moderator', description: 'Роль' })
  readonly value: string;
  @ApiProperty({ example: '1', description: 'id юзера для выдачи роли' })
  readonly userId: number;
}
