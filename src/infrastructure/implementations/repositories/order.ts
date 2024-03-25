import { OrderDTO } from '@domain/dtos';
import { OrderEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { OrderRepository } from '@domain/repositories';
import { ClientModel, RestaurantModel } from '@infrastructure/data/models';
import OrderModel from '@infrastructure/data/models/order.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class OrderRepositoryImpl implements OrderRepository {
  create = async (orderDTO: OrderDTO): Promise<OrderEntity | null> => {
    try {
      const orderRepository =
        postgreSQLDatabase.datasource.getRepository(OrderModel);
      const clientRepository =
        postgreSQLDatabase.datasource.getRepository(ClientModel);
      const restaurantRepository =
        postgreSQLDatabase.datasource.getRepository(RestaurantModel);

      const client = await clientRepository.findOne({
        where: { id: orderDTO.clientId },
      });
      if (client === null)
        throw CustomHTTPError.badRequest(
          'Cannot create a order because client does not exist',
        );

      const restaurant = await restaurantRepository.findOne({
        where: { id: orderDTO.restaurantId },
      });
      if (restaurant === null)
        throw CustomHTTPError.badRequest(
          'Cannot create a order because restaurant does not exist',
        );

      const newOrder = new OrderModel();
      newOrder.client = client;
      newOrder.restaurant = restaurant;
      newOrder.type = orderDTO.type;
      if (orderDTO.paymentMethod) {
        newOrder.paymentMethod = orderDTO.paymentMethod;
      }

      const order = await orderRepository.save(newOrder);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  update = async (
    id: string,
    changes: OrderEntity,
  ): Promise<OrderEntity | null> => {
    try {
      const orderRepository =
        postgreSQLDatabase.datasource.getRepository(OrderModel);
      const order = await orderRepository.findOne({ where: { id } });
      if (order === null)
        throw CustomHTTPError.badRequest(
          'Cannot update a order that does not exist',
        );
      orderRepository.merge(order, changes);
      const updatedOrder = await orderRepository.save(order!);
      return updatedOrder;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  all = async (
    take: number,
    skip: number,
    restaurantId: string,
  ): Promise<OrderEntity[]> => {
    try {
      const orderRepository =
        postgreSQLDatabase.datasource.getRepository(OrderModel);
      const orders = await orderRepository.find({
        where: { restaurant: { id: restaurantId } },
        skip,
        take,
        relations: ['client', 'restaurant'],
      });
      return orders;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return [];
    }
  };
}
