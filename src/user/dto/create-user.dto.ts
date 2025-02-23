import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Kiet', description: 'Username' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'test_poc@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;
}
