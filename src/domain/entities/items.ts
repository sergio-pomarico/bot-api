import OrderEntity from './order';
import { ProductEntity } from './product';

export interface OrderItemEntity {
  product: ProductEntity;
  attributeId?: string;
  quantity: number;
  price: number;
  order: OrderEntity;
}
