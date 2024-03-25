import RestaurantEntity from './restaurant';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  RESTAURANT_ADMIN = 'RESTAURANT_OWNER',
}

export default interface UserEntity {
  id?: string;
  email: string;
  password: string;
  phone?: number;
  active?: boolean;
  lastLogin?: Date;
  restaurant?: RestaurantEntity;
  role?: UserRoles;
  createdAt?: Date;
  updatedAt?: Date;
}
