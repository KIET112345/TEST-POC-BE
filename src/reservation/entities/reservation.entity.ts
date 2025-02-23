import { BaseEntity } from 'common/entities/base.entity';
import { User } from 'user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Reservation extends BaseEntity {
  @AutoMap()
  @Column()
  bookingDate: string;

  @AutoMap()
  @Column()
  bookingTime: string;

  @AutoMap()
  @Column()
  seats: number;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  user: User;
}
