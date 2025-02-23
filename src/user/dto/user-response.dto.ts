import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'Kiet', description: 'Username' })
  @AutoMap()
  name: string;

  @ApiProperty({ example: 'test_poc@gmail.com', description: 'User email' })
  @AutoMap()
  email: string;
}
