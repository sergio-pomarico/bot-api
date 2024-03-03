import RestaurantDTO from '@domain/dtos/restaurant';
import { RestaurantEntity } from '@domain/entities';

export interface RestaurantRepository {
  create: (productDTO: RestaurantDTO) => Promise<RestaurantEntity | null>;
  findById: (id: string) => Promise<RestaurantEntity | null>;
  all: () => Promise<RestaurantEntity[] | null>;
}
