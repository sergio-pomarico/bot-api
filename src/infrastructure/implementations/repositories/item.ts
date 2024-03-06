import { OrderItemDTO } from '@domain/dtos';
import { OrderItemEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { OrderItemRepository } from '@domain/repositories';
import { ProductModel } from '@infrastructure/data/models';
import OrderItemModel from '@infrastructure/data/models/order.item.model';
import OrderModel from '@infrastructure/data/models/order.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class OrderItemRepositoryImpl implements OrderItemRepository {
  create = async (
    orderItemDTO: OrderItemDTO,
  ): Promise<OrderItemEntity | null> => {
    try {
      const itemRepository =
        postgreSQLDatabase.datasource.getRepository(OrderItemModel);
      const orderRepository =
        postgreSQLDatabase.datasource.getRepository(OrderModel);
      const productRepository =
        postgreSQLDatabase.datasource.getRepository(ProductModel);

      const order = await orderRepository.findOne({
        where: { id: orderItemDTO.orderId },
      });
      if (order === null)
        throw CustomHTTPError.badRequest(
          'Cannot create a item because order does not exist',
        );

      const product = await productRepository.findOne({
        where: { id: orderItemDTO.productId },
      });

      if (product === null)
        throw CustomHTTPError.badRequest(
          'Cannot create a item because product does not exist',
        );

      const newOrderItem = new OrderItemModel();
      newOrderItem.order = order;
      newOrderItem.product = product;
      newOrderItem.price = orderItemDTO.price;
      newOrderItem.quantity = orderItemDTO.quantity;
      if (orderItemDTO.attributeId) {
        newOrderItem.attributeId = orderItemDTO.attributeId;
      }
      const item = await itemRepository.save(newOrderItem);
      return item;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
