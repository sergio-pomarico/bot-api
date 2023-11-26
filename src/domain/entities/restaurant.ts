export default interface RestaurantEntity {
  id?: string;
  name: string;
  address: string;
  lat?: number;
  long?: number;
  phone: number;
  createdAt?: Date;
  updatedAt?: Date;
}
