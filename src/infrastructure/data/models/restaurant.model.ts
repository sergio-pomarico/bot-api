import { RestaurantEntity } from '@domain/entities';
import { Column, Entity } from 'typeorm';
import BaseModel from './base.model';

@Entity({ name: 'restaurant' })
export default class RestaurantModel
  extends BaseModel
  implements RestaurantEntity
{
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;
}
