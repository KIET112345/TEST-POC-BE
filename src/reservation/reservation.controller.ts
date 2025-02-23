import { Body, Controller, Get, Post, Query, Version } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  ReservationPaginationDto,
  ReservationResponseDto,
} from './dto/reservation-response.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  ApiBadRequestResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get all reservations with pignation' })
  @ApiQuery({
    name: 'start',
    type: 'string',
    required: true,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'end',
    type: 'string',
    required: true,
    example: '2024-01-02',
  })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'List of reservation',
    type: ReservationPaginationDto,
  })
  async getReservations(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('page') page = 1,
    @Query('limit') limit: 5,
  ): Promise<ReservationPaginationDto> {
    return this.reservationService.getReservations(start, end, page, limit);
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new reservation by user email' })
  @ApiResponse({
    status: 201,
    description: 'Reservation is created successfully',
    type: ReservationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Not found user email' })
  async createReservation(
    @Body() createDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationService.createReservation(createDto);
  }
}
