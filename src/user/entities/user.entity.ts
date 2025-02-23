import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'common/entities/base.entity';
import { Reservation } from 'reservation/entities/reservation.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
