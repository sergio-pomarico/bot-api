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
      newOrder.paymentMethod = orderDTO.paymentMethod;

      const order = await orderRepository.save(newOrder);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
