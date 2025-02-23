import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Between, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  ReservationPaginationDto,
  ReservationResponseDto,
} from './dto/reservation-response.dto';
import { UserService } from 'user/user.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { plainToInstance } from 'class-transformer';
import { User } from 'user/entities/user.entity';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly maximumTables = 5;
  private readonly seatsPerTable = 4;
  private readonly openingHours = ['19:00', '20:00', '21:00', '22:00', '23:00'];

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly userService: UserService,
    @InjectMapper()
    private readonly autoMapper: Mapper,
  ) {}

  /**
   * User books a reservation at a date and time
   * @param createDto input booking date, time, seats
   * @returns reservation info which user booked successfully
   */
  async createReservation(
    createDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    if (!this.isValidBookingTime(createDto.bookingTime)) {
      this.logger.debug(
        `User has email ${createDto.email} select invalid booking time`,
      );
      throw new BadRequestException(
        `Booking time ${createDto.bookingTime} is invalid. Please select another time`,
      );
    }
    const canBooking = await this.canBooking(
      createDto.bookingDate,
      createDto.bookingTime,
    );

    if (canBooking) {
      this.logger.debug(`User has email ${createDto.email} is overbooking`);
      throw new BadRequestException(
        `No available seats in this date ${createDto.bookingDate} and time ${createDto.bookingTime}`,
      );
    }

    const userDto = await this.userService.getUserByEmail(createDto.email);
    const user = plainToInstance(User, userDto);
    const reservation = this.reservationRepository.create({
      ...createDto,
      user,
    });
    await this.reservationRepository.save(reservation);
    this.logger.log(`User has email ${user.email} books successfully`);

    return this.autoMapper.map(
      reservation,
      Reservation,
      ReservationResponseDto,
    );
  }

  /**
   * Get reservations with pagination
   * @param start start from page
   * @param end end of page
   * @param page current page
   * @param limit limit record per page
   * @returns records of reservation and pagination information
   */
  async getReservations(
    start: string,
    end: string,
    page = 1,
    limit = 5,
  ): Promise<ReservationPaginationDto> {
    const [reservations, total] = await this.reservationRepository.findAndCount(
      {
        where: { bookingDate: Between(start, end) },
        order: { bookingDate: 'ASC', bookingTime: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );
    this.logger.log(`Total records in database ${total}`);

    const response: ReservationPaginationDto = {
      data: this.autoMapper.mapArray(
        reservations,
        Reservation,
        ReservationResponseDto,
      ),
      pagination: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };

    return response;
  }

  /**
   * Whether booking is valid or not base on time frame
   * @param bookingTime booking Time
   * @returns true if booking time is valid and vice versa
   */
  private isValidBookingTime(bookingTime: string): boolean {
    return this.openingHours.includes(bookingTime);
  }

  /**
   * Whether user is able to book or not
   * @param bookingDate booking Date
   * @param bookingTime booking Time
   * @returns true if user is able to book and vice versa
   */
  private async canBooking(
    bookingDate: string,
    bookingTime: string,
  ): Promise<boolean> {
    const totalSeats = this.maximumTables * this.seatsPerTable;
    const bookedSeats = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.seats)', 'totalSeats')
      .where('reservation.bookingDate = :bookingDate', { bookingDate })
      .andWhere('reservation.bookingTime = :bookingTime', { bookingTime })
      .getRawOne();

    this.logger.debug(`Raw SQL ${JSON.stringify(bookedSeats)}`);

    const result = (bookedSeats?.totalSeats || 0) >= totalSeats;
    return result;
  }
}
