import { OrderItemDTO } from '@domain/dtos';
import { OrderItemEntity } from '@domain/entities';

export interface OrderItemRepository {
  create: (orderItemDTO: OrderItemDTO) => Promise<OrderItemEntity | null>;
}
