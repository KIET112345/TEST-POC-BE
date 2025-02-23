import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({example: '2024-01-01', description: 'Booking date'})
  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({example: '21:00', description: 'Booking time'})
  @IsNotEmpty()
  bookingTime: string;

  @ApiProperty({example: 3, description: 'Number of seats (maximum is 4)'})
  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;

  @ApiProperty({example: 'test_poc@gmail.com', description: 'User email'})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
