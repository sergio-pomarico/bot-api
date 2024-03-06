import ClientEntity from './client';
import { OrderItemEntity } from './items';
import RestaurantEntity from './restaurant';

export default interface OrderEntity {
  id?: string;
  restaurant?: RestaurantEntity;
  client?: ClientEntity;
  type?: OrderType;
  comment?: string;
  items?: OrderItemEntity[];
  paymentMethod?: PaymentMethod;
}

export enum OrderType {
  HOME_DELIVERY = 'HOME_DELIVERY',
  PICK_UP_AT_RESTAURANT = 'PICK_UP_AT_RESTAURANT',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}
