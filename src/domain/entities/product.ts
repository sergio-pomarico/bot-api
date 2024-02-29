export interface ProductEntity {
  id: string;
  name: string;
  price?: number;
  description?: string;
  categoryId?: string;
  image?: string;
  attributeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
