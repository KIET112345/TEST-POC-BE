import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ReservationResponseDto } from 'reservation/dto/reservation-response.dto';
import { Reservation } from 'reservation/entities/reservation.entity';

@Injectable()
export class ReservationProfile extends AutomapperProfile {
  constructor(@InjectMapper() autoMapper: Mapper) {
    super(autoMapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Reservation,
        ReservationResponseDto,
        forMember(
          (dest) => dest.email,
          mapFrom((src) => src.user.email),
        ),
      );
    };
  }
}
