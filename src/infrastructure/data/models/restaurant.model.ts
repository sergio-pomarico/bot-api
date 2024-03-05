import { RestaurantEntity } from '@domain/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseModel from './base.model';
import OrderModel from './order.model';

@Entity({ name: 'restaurant' })
export default class RestaurantModel
  extends BaseModel
  implements RestaurantEntity
{
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => OrderModel, (order) => order.restaurant)
  orders: OrderModel[];
}
