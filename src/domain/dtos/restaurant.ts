import { z } from 'zod';

import { RestaurantEntity } from '../entities';

const restaurantDTOValidator = z.object({
  name: z.string().min(3),
  address: z.string().min(3),
  phone: z.string().min(10),
});

export default class RestaurantDTO {
  private constructor(
    public name: string,
    public address: string,
    public phone: string,
  ) {}

  static create(data: { [key in keyof RestaurantEntity]: string }): [
    Error?,
    RestaurantDTO?,
  ] {
    const result = restaurantDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new RestaurantDTO(data.name!, data.address!, data.phone!),
    ];
  }
}
