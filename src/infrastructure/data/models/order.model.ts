import { OrderEntity, OrderType, PaymentMethod } from '@domain/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from './base.model';
import RestaurantModel from './restaurant.model';
import ClientModel from './client.model';
import OrderItemModel from './order.item.model';

@Entity({ name: 'order' })
export default class OrderModel extends BaseModel implements OrderEntity {
  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment: string;

  @ManyToOne(() => ClientModel, (client) => client.orders)
  @JoinColumn({ name: 'client_id' })
  client: ClientModel;

  @ManyToOne(() => RestaurantModel, (restaurant) => restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantModel;

  @OneToMany(() => OrderItemModel, (item) => item.order)
  items: OrderItemModel[];
}
