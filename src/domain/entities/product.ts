import { ProductAttributeEntity } from './attribute';

export interface ProductEntity {
  id: string;
  name: string;
  price?: number;
  description?: string;
  categoryId?: string;
  image?: string;
  attributes?: ProductAttributeEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}
