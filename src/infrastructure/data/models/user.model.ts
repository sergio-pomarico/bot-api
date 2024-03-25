import { UserEntity } from '@domain/entities';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseModel from './base.model';
import { UserRoles } from '@domain/entities/user';
import RestaurantModel from './restaurant.model';

@Entity({ name: 'user' })
export default class UserModel extends BaseModel implements UserEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'bigint', unique: true })
  phone: number;

  @Column({ default: false })
  active: boolean;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @ManyToOne(() => RestaurantModel, (restaurant) => restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantModel;

  @Column({
    name: 'last_login',
    type: 'timestamptz',
    nullable: true,
  })
  lastLogin: Date;
}
