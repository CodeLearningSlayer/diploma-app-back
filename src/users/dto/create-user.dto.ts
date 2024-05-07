import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'mail@ya.ru', description: 'Почта' })
  @IsString({ message: 'Must be a string value' })
  @IsEmail({}, { message: 'Not correct email' })
  readonly email: string;
  @IsString({ message: 'Must be a string value' })
  @ApiProperty({ example: '12345', description: 'Пароль' })
  @Length(4, 16, { message: 'Minimum 4 and maximum 16 symbols' })
  readonly password: string;
}
