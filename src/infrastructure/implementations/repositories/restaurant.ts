import RestaurantDTO from '@domain/dtos/restaurant';
import { RestaurantEntity } from '@domain/entities';
import { RestaurantRepository } from '@domain/repositories/restaurant';
import { RestaurantModel } from '@infrastructure/data/models';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class RestaurantRepositoryImpl implements RestaurantRepository {
  create = async (
    restaurantDTO: RestaurantDTO,
  ): Promise<RestaurantEntity | null> => {
    try {
      const restaurantRepository =
        postgreSQLDatabase.datasource.getRepository(RestaurantModel);
      const newRestaurant = new RestaurantModel();
      newRestaurant.name = restaurantDTO.name;
      newRestaurant.address = restaurantDTO.address;
      newRestaurant.phone = restaurantDTO.phone;
      const restaurant = await restaurantRepository.save(newRestaurant);
      return restaurant;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  findById = async (id: string): Promise<RestaurantEntity | null> => {
    try {
      const restaurantRepository =
        postgreSQLDatabase.datasource.getRepository(RestaurantModel);
      const restaurant = await restaurantRepository.findOne({
        where: { id },
      });
      return restaurant;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  all = async (): Promise<RestaurantEntity[] | null> => {
    try {
      const restaurantRepository =
        postgreSQLDatabase.datasource.getRepository(RestaurantModel);
      const restaurants = await restaurantRepository.find();
      return restaurants;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
