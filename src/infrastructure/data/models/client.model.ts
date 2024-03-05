import { ClientEntity } from '@domain/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseModel from './base.model';
import OrderModel from './order.model';

@Entity({ name: 'client' })
export default class ClientModel extends BaseModel implements ClientEntity {
  @Column()
  fullname: string;

  @Column()
  address: string;

  @Column({ type: 'bigint', unique: true })
  documentId: number;

  @Column({ type: 'bigint', unique: true })
  phone: number;

  @OneToMany(() => OrderModel, (order) => order.client)
  orders: OrderModel[];
}
