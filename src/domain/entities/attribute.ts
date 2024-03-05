import { ProductEntity } from './product';

export interface ProductAttributeEntity {
  id: string;
  title: string;
  description?: string;
  price?: number;
  product?: ProductEntity;
  size?: Size;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Size {
  Small = 'small',
  Personal = 'personal',
  Medium = 'medium',
  large = 'large',
}
