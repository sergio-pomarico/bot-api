import { OrderDTO } from '@domain/dtos';
import { OrderEntity } from '@domain/entities';

export interface OrderRepository {
  create: (orderDTO: OrderDTO) => Promise<OrderEntity | null>;
  update: (id: string, changes: OrderEntity) => Promise<OrderEntity | null>;
}
