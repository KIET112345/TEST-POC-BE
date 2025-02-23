import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @AutoMap()
  @ApiProperty({ example: '2024-01-01', description: 'Booking date' })
  bookingDate: string;

  @AutoMap()
  @ApiProperty({ example: '21:00', description: 'Booking time' })
  bookingTime: string;

  @AutoMap()
  @ApiProperty({ example: 3, description: 'Number of seats (maximum is 4)' })
  seats: number;

  @AutoMap()
  @ApiProperty({ example: 'test_poc@gmail.com', description: 'User email' })
  email: string;
}

export class Pagination {
  @ApiProperty({ example: 10, description: 'Total records in database' })
  total: number;
  @ApiProperty({ example: 1, description: 'Page number' })
  page: number;
  @ApiProperty({ example: 1, description: 'Last page number' })
  lastPage: number;
}

export class ReservationPaginationDto {
  @ApiProperty({
    type: [ReservationResponseDto],
    isArray: true,
    description: 'List of reservation',
  })
  data: ReservationResponseDto[];
  @ApiProperty({ type: Pagination, description: 'Pagination information' })
  pagination: Pagination;
}
